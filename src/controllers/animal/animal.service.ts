/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { Animal } from './animal.entity';
import { FilterAnimalDto } from './animal.dto';
import { UserService } from '../user/user.service';
import { NutritionalService } from '../nutritional/nutritional.service';
import { AnimalDocumentService } from './documents/animal-document.service';
import { Breed } from './breed.entity';
import { Coat } from './coat.entity';
@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal) private readonly animal: Repository<Animal>,
    @InjectRepository(Breed) private readonly breed: Repository<Breed>,
    @InjectRepository(Coat) private readonly coat: Repository<Coat>,
    @Inject(forwardRef(() => AnimalDocumentService))
    private readonly documentService: AnimalDocumentService,
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
    private readonly nutriService: NutritionalService,
  ) {}

  async create(body: Animal, photo: Express.Multer.File): Promise<Animal> {
    let imageUrl: string | null = null;

    if (body.breed_id) {
      const breed = await this.breed.findOne({ where: { id: body.breed_id } });
      if (!breed) {
        throw new HttpException('Raça não encontrada', HttpStatus.BAD_REQUEST);
      }
      body.breed = breed;

      if (body.coat_id) {
        const coat = await this.coat.findOne({
          where: { id: body.coat_id, breed_id: body.breed_id },
        });
        if (!coat) {
          throw new HttpException(
            'Pelagem não encontrada para esta raça',
            HttpStatus.BAD_REQUEST,
          );
        }
        body.coat = coat;
      }
    }

    if (!!photo) {
      const url = await this.s3Service.upload(photo, 'animal');
      imageUrl = url;
    }

    const dono = await this.userService.findOne(body.owner);

    if (body.father && body.father !== '') {
      const pai = await this.findByNameInProperty(body.father, body.owner);
      if (pai) body.father_id = pai.id;
    }
    if (body.mother && body.mother !== '') {
      const mae = await this.findByNameInProperty(body.mother, body.owner);
      if (mae) body.mother_id = mae.id;
    }

    if (body.property !== 'Terceiros') {
      body.owner_name = dono.name;
    }

    body.photo = imageUrl;

    return await this.animal.save(body);
  }

  async findAll(): Promise<Animal[]> {
    return this.animal.find({
      relations: ['breed', 'coat'],
    });
  }

  async findOne(id: string): Promise<Animal> {
    const verify = await this.animal.findOne({
      where: { id },
      relations: ['breed', 'coat'],
    });
    if (!verify) {
      throw new HttpException('Animal não encontrado', HttpStatus.BAD_REQUEST);
    }
    return verify;
  }

  async findByNameInProperty(
    name: string,
    owner: string,
  ): Promise<Animal | null> {
    const animal = await this.animal.findOne({ where: { name, owner } });
    return animal || null;
  }

  async findAncestors(animalId: string, generation: number): Promise<any[]> {
    const animal = await this.animal.findOne({ where: { id: animalId } });

    if (!animal || generation > 4) {
      return [];
    }

    const ancestors = [];
    const motherAncestors = [];
    const fatherAncestors = [];

    if (animal.mother_id) {
      const mother = await this.animal.findOne({
        where: { id: animal.mother_id },
      });
      motherAncestors.push(
        ...(await this.findAncestors(animal.mother_id, generation + 1)),
      );
      ancestors.push(
        { generation: generation, animal: mother, gender: 'female' },
        ...motherAncestors,
      );
    }

    if (animal.father_id) {
      const father = await this.animal.findOne({
        where: { id: animal.father_id },
      });
      fatherAncestors.push(
        ...(await this.findAncestors(animal.father_id, generation + 1)),
      );
      ancestors.push(
        { generation: generation, animal: father, gender: 'male' },
        ...fatherAncestors,
      );
    }

    return ancestors;
  }

  async findOneWithFamily(id: string): Promise<any> {
    const animal = await this.animal.findOne({ where: { id } });

    if (!animal) {
      throw new HttpException('Animal não encontrado', HttpStatus.BAD_REQUEST);
    }

    const ancestors = await this.findAncestors(id, 1);

    return {
      animal,
      ancestors,
    };
  }

  async findByOwner(id: string): Promise<Animal[]> {
    return this.animal.find({
      where: { owner: id },
      relations: ['breed', 'coat'],
    });
  }

  async findByProperty(property_id: string): Promise<Animal[]> {
    return this.animal.find({
      where: { property: property_id },
      relations: ['breed', 'coat'],
      order: { name: 'ASC' },
    });
  }

  async update(
    id: string,
    body: any,
    photo: Express.Multer.File,
  ): Promise<Animal> {
    const verify = await this.findOne(id);

    let imageUrl: string | null = verify.photo;

    if (!!photo) {
      const url = await this.s3Service.upload(photo, 'animal');
      imageUrl = url;

      if (verify.photo) {
        await this.s3Service.deleteFileS3(verify.photo);
      }
    }

    if (body.breed_id && body.breed_id !== verify.breed_id) {
      const breed = await this.breed.findOne({ where: { id: body.breed_id } });
      if (!breed) {
        throw new HttpException('Raça não encontrada', HttpStatus.BAD_REQUEST);
      }
      verify.breed = breed;
      verify.breed_id = breed.id;

      if (body.coat_id) {
        const coat = await this.coat.findOne({
          where: { id: body.coat_id, breed_id: body.breed_id },
        });
        if (!coat) {
          throw new HttpException(
            'Pelagem não encontrada para esta raça',
            HttpStatus.BAD_REQUEST,
          );
        }
        verify.coat = coat;
        verify.coat_id = coat.id;
      } else {
        verify.coat = null;
        verify.coat_id = null;
      }
    } else if (body.coat_id && body.coat_id !== verify.coat_id) {
      if (!verify.breed_id) {
        throw new HttpException(
          'Selecione uma raça antes de escolher a pelagem',
          HttpStatus.BAD_REQUEST,
        );
      }

      const coat = await this.coat.findOne({
        where: { id: body.coat_id, breed_id: verify.breed_id },
      });
      if (!coat) {
        throw new HttpException(
          'Pelagem não encontrada para esta raça',
          HttpStatus.BAD_REQUEST,
        );
      }
      verify.coat = coat;
      verify.coat_id = coat.id;
    }

    body.photo = imageUrl;
    body.name = body.name || verify.name;
    body.registerNumber = body.registerNumber || verify.registerNumber;
    body.property = body.property || verify.property;
    body.sex = body.sex || verify.sex;
    body.birthDate = body.birthDate || verify.birthDate;

    if (body.property === 'Terceiros') {
      body.owner_name = body.owner_name || verify.owner_name;
    } else {
      const dono = await this.userService.findOne(body.owner || verify.owner);
      body.owner_name = dono.name;
    }

    if (body.castrationDate === '') {
      body.castrationDate = null;
    } else {
      body.castrationDate = body.castrationDate || verify.castrationDate;
    }

    if (body.castrated === '') {
      body.castrated = null;
    } else {
      body.castrated = body.castrated === 'true';
    }

    body.father = body.father || verify.father;
    body.mother = body.mother || verify.mother;
    body.occupation = body.occupation || verify.occupation;
    body.sale = body.sale || verify.sale;
    body.value = body.value || verify.value;

    await this.animal.update(id, body);
    return this.findOne(id);
  }

  async lifeStats(id: string): Promise<any> {
    const verify = await this.findOne(id);

    if (!verify) {
      throw new HttpException('Animal não encontrado', HttpStatus.BAD_REQUEST);
    }

    await this.animal
      .createQueryBuilder()
      .update(Animal)
      .set({ alive: !verify.alive })
      .where('id = :id', { id })
      .execute();

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const verify = await this.findOne(id);

    if (verify.photo) {
      await this.s3Service.deleteFileS3(verify.photo);
    }

    await this.documentService.removeAllDocuments(id);

    await this.nutriService.removeManagement(id);
    await this.animal.delete(id);
  }

  async findNameWithId(owner: string): Promise<any[]> {
    const animals = await this.findByOwner(owner);

    return animals.map((animal) => ({
      id: animal.id,
      name: animal.name,
      breed: animal.breed?.name,
      coat: animal.coat?.name,
    }));
  }

  async findAllNames(): Promise<string[]> {
    const animals = await this.animal.find();
    const uniqueNames = new Set<string>();

    animals.forEach((animal) => {
      uniqueNames.add(animal.name);
    });

    return Array.from(uniqueNames);
  }

  async findAllNamesWithId(
    sex?: string,
    property_id?: string,
  ): Promise<{ label: string; value: string }[]> {
    const animals = await this.animal.find({
      where: {
        sex: sex || undefined,
        property: property_id || undefined,
      },
      order: {
        name: 'ASC',
      },
    });
    const uniqueNames: { label: string; value: string }[] = [];

    animals.forEach((animal) => {
      uniqueNames.push({ label: animal.name, value: animal.id });
    });

    return uniqueNames;
  }

  async findOneNameByProperty(property: string, name: string): Promise<any> {
    return await this.animal.findOne({ where: { name, property } });
  }

  async findAllNamesByProperty(
    property_id: string,
    sex?: string,
  ): Promise<any[]> {
    const whereConditions: any = {
      property: property_id,
      alive: true,
    };

    if (sex) {
      whereConditions.sex = sex;
    }

    const animals = await this.animal.find({
      select: ['id', 'name', 'registerNumber', 'sex'],
      where: whereConditions,
    });

    const uniqueNames: any[] = animals.map((animal) => ({
      label: animal.name,
      value: animal.id,
    }));

    return uniqueNames;
  }

  async findByRegisterNumber(
    registerNumber: string,
    propertyId: string,
  ): Promise<Animal | null> {
    if (!registerNumber || !registerNumber.trim()) {
      return null;
    }

    try {
      const animal = await this.animal.findOne({
        where: {
          registerNumber: registerNumber.trim(),
          property: propertyId,
        },
      });

      return animal || null;
    } catch (error) {
      console.error('Erro ao buscar animal por número de registro:', error);
      return null;
    }
  }

  async findAllSexes(): Promise<string[]> {
    const animals = await this.animal.find();
    const uniqueSexes = new Set<string>();

    animals.forEach((animal) => {
      uniqueSexes.add(animal.sex);
    });

    return Array.from(uniqueSexes);
  }

  async findAllOccupations(): Promise<string[]> {
    const animals = await this.animal.find();
    const uniqueOccupations = new Set<string>();

    animals.forEach((animal) => {
      uniqueOccupations.add(animal.occupation);
    });

    return Array.from(uniqueOccupations);
  }

  async findFiltered(filterDto: FilterAnimalDto): Promise<Animal[]> {
    const queryBuilder = this.animal
      .createQueryBuilder('animal')
      .leftJoinAndSelect('animal.breed', 'breed')
      .leftJoinAndSelect('animal.coat', 'coat');

    if (filterDto.initialDate) {
      queryBuilder.andWhere('animal.birthDate >= :initialDate', {
        initialDate: filterDto.initialDate,
      });
    }

    if (filterDto.lastDate) {
      queryBuilder.andWhere('animal.birthDate <= :lastDate', {
        lastDate: filterDto.lastDate,
      });
    }

    if (filterDto.owner) {
      queryBuilder.andWhere('animal.owner_name ILIKE :owner_name', {
        owner_name: `%${filterDto.owner}%`,
      });
    }

    if (filterDto.breed_id) {
      queryBuilder.andWhere('animal.breed_id = :breed_id', {
        breed_id: filterDto.breed_id,
      });
    }

    if (filterDto.coat_id) {
      queryBuilder.andWhere('animal.coat_id = :coat_id', {
        coat_id: filterDto.coat_id,
      });
    }

    if (filterDto.sex) {
      queryBuilder.andWhere('animal.sex = :sex', { sex: filterDto.sex });
    }

    if (
      filterDto.order &&
      (filterDto.order.toUpperCase() === 'ASC' ||
        filterDto.order.toUpperCase() === 'DESC')
    ) {
      queryBuilder.addOrderBy(
        'animal.registerDate',
        filterDto.order as 'ASC' | 'DESC',
      );
    }

    return queryBuilder.getMany();
  }

  async createBreed(body: {
    name: string;
    description?: string;
  }): Promise<Breed> {
    const existingBreed = await this.breed.findOne({
      where: { name: body.name },
    });

    if (existingBreed) {
      throw new HttpException('Raça já cadastrada', HttpStatus.BAD_REQUEST);
    }

    const breed = new Breed();
    breed.name = body.name;
    breed.description = body.description || '';
    breed.active = true;

    return await this.breed.save(breed);
  }

  async findAllBreeds(): Promise<Breed[]> {
    return this.breed.find({
      where: { active: true },
      order: { name: 'ASC' },
    });
  }

  async findBreedWithCoats(id: string): Promise<Breed> {
    const breed = await this.breed.findOne({
      where: { id, active: true },
      relations: ['coats'],
    });

    if (!breed) {
      throw new HttpException('Raça não encontrada', HttpStatus.NOT_FOUND);
    }

    return breed;
  }

  async updateBreed(
    id: string,
    body: { name?: string; description?: string },
  ): Promise<Breed> {
    const breed = await this.breed.findOne({ where: { id } });

    if (!breed) {
      throw new HttpException('Raça não encontrada', HttpStatus.NOT_FOUND);
    }

    if (body.name && body.name !== breed.name) {
      const existingBreed = await this.breed.findOne({
        where: { name: body.name },
      });
      if (existingBreed) {
        throw new HttpException(
          'Nome de raça já existe',
          HttpStatus.BAD_REQUEST,
        );
      }
      breed.name = body.name;
    }

    if (body.description !== undefined) {
      breed.description = body.description;
    }

    return await this.breed.save(breed);
  }

  async deleteBreed(id: string): Promise<void> {
    const breed = await this.breed.findOne({
      where: { id },
      relations: ['coats'],
    });

    if (!breed) {
      throw new HttpException('Raça não encontrada', HttpStatus.NOT_FOUND);
    }

    const animalsWithBreed = await this.animal.count({
      where: { breed_id: id },
    });

    if (animalsWithBreed > 0) {
      throw new HttpException(
        'Não é possível excluir esta raça pois existem animais cadastrados com ela',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (breed.coats && breed.coats.length > 0) {
      await this.coat.remove(breed.coats);
    }

    await this.breed.delete(id);
  }

  async createCoat(body: {
    name: string;
    breed_id: string;
    description?: string;
  }): Promise<Coat> {
    const breed = await this.breed.findOne({
      where: { id: body.breed_id, active: true },
    });

    if (!breed) {
      throw new HttpException('Raça não encontrada', HttpStatus.NOT_FOUND);
    }

    const existingCoat = await this.coat.findOne({
      where: { name: body.name, breed_id: body.breed_id },
    });

    if (existingCoat) {
      throw new HttpException(
        'Pelagem já cadastrada para esta raça',
        HttpStatus.BAD_REQUEST,
      );
    }

    const coat = new Coat();
    coat.name = body.name;
    coat.breed = breed;
    coat.breed_id = breed.id;
    coat.description = body.description || '';
    coat.active = true;

    return await this.coat.save(coat);
  }

  async findAllCoats(): Promise<Coat[]> {
    return this.coat.find({
      where: { active: true },
      relations: ['breed'],
      order: { name: 'ASC' },
    });
  }

  async findCoatsByBreed(breed_id: string): Promise<Coat[]> {
    const breed = await this.breed.findOne({
      where: { id: breed_id, active: true },
    });

    if (!breed) {
      throw new HttpException('Raça não encontrada', HttpStatus.NOT_FOUND);
    }

    return this.coat.find({
      where: { breed_id, active: true },
      order: { name: 'ASC' },
    });
  }

  async updateCoat(
    id: string,
    body: { name?: string; description?: string },
  ): Promise<Coat> {
    const coat = await this.coat.findOne({
      where: { id },
      relations: ['breed'],
    });

    if (!coat) {
      throw new HttpException('Pelagem não encontrada', HttpStatus.NOT_FOUND);
    }

    if (body.name && body.name !== coat.name) {
      const existingCoat = await this.coat.findOne({
        where: { name: body.name, breed_id: coat.breed_id },
      });

      if (existingCoat) {
        throw new HttpException(
          'Nome de pelagem já existe para esta raça',
          HttpStatus.BAD_REQUEST,
        );
      }
      coat.name = body.name;
    }

    if (body.description !== undefined) {
      coat.description = body.description;
    }

    return await this.coat.save(coat);
  }

  async deleteCoat(id: string): Promise<void> {
    const coat = await this.coat.findOne({ where: { id } });

    if (!coat) {
      throw new HttpException('Pelagem não encontrada', HttpStatus.NOT_FOUND);
    }

    const animalsWithCoat = await this.animal.count({ where: { coat_id: id } });

    if (animalsWithCoat > 0) {
      throw new HttpException(
        'Não é possível excluir esta pelagem pois existem animais cadastrados com ela',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.coat.delete(id);
  }
}

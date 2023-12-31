/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { Animal } from './animal.entity';
import { FilterAnimalDto } from './animal.dto';
import { UserService } from '../user/user.service';
@Injectable()
export class AnimalService {
    constructor(
        @InjectRepository(Animal) private readonly animal: Repository<Animal>,
        private readonly s3Service: S3Service,
        private readonly userService: UserService
    ) { }

    async create(body: Animal, photo: Express.Multer.File): Promise<Animal> {
        let imageUrl: string | null = null;

        if (!!photo) {
            const url = await this.s3Service.upload(photo, 'animal');
            imageUrl = url;
        }

        const dono = await this.userService.findOne(body.owner)
        
        body.owner_name = dono.name;
        body.photo = imageUrl;

        return await this.animal.save(body);
    }

    async findAll(): Promise<Animal[]> {
        return this.animal.find();
    }

    async findOne(id: string): Promise<Animal> {
        const verify = await this.animal.findOne({ where: { id } });
        if (!verify) {
            throw new HttpException('Animal não encontrado', HttpStatus.BAD_REQUEST);
        }
        return verify;
    }

    async findByOwner(id: string): Promise<Animal[]> {
        return this.animal.find({ where: { owner: id } });
    }

    async update(id: string, body: any, photo: Express.Multer.File): Promise<Animal> {
        const verify = await this.findOne(id);

        let imageUrl: string | null = verify.photo;

        if (!!photo) {
            const url = await this.s3Service.upload(photo, 'animal');
            imageUrl = url;

            if (verify.photo) {
                await this.s3Service.deleteFileS3(verify.photo);
            }
        }

        // Atualiza os campos que não podem ser nulos
        body.photo = imageUrl;
        body.name = body.name || verify.name;
        body.race = body.race || verify.race;
        body.coat = body.coat || verify.coat;
        body.sex = body.sex || verify.sex;
        body.birthDate = body.birthDate || verify.birthDate;

        // Seta nulo quando vier vazio
        if (body.castrationDate === '') {
            body.castrationDate = null;
        }
        else {
            body.castrationDate = body.castrationDate || verify.castrationDate;
        }

        // Seta nulo quando vier vazio
        if (body.castrated === '') {
            body.castrated = null;
        }
        else {
            // Converte para booleano
            body.castrated = body.castrated === 'true';
        }

        await this.animal.update(id, body);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const verify = await this.findOne(id);

        // Remove a imagem da AWS
        if (verify.photo) {
            await this.s3Service.deleteFileS3(verify.photo);
        }

        await this.animal.delete(id);
    }

    async findAllNames(): Promise<string[]> {
        const animals = await this.animal.find();
        const uniqueNames = new Set<string>();

        animals.forEach((animal) => {
            uniqueNames.add(animal.name);
        });

        return Array.from(uniqueNames);
    }

    async findAllBreeds(): Promise<string[]> {
        const animals = await this.animal.find();
        const uniqueRaces = new Set<string>();

        animals.forEach((animal) => {
            uniqueRaces.add(animal.race);
        });

        return Array.from(uniqueRaces);
    }

    async findAllCoats(): Promise<string[]> {
        const animals = await this.animal.find();
        const uniqueCoats = new Set<string>();

        animals.forEach((animal) => {
            uniqueCoats.add(animal.coat);
        });

        return Array.from(uniqueCoats);
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
        const queryBuilder = this.animal.createQueryBuilder('animal');

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
            queryBuilder.andWhere('animal.owner_name ILIKE :owner_name', { owner_name: `%${filterDto.owner}%` });
        }

        if (filterDto.race) {
            queryBuilder.andWhere('animal.race = :race', { race: filterDto.race });
        }

        if (filterDto.coat) {
            queryBuilder.andWhere('animal.coat = :coat', { coat: filterDto.coat });
        }

        if (filterDto.sex) {
            queryBuilder.andWhere('animal.sex = :sex', { sex: filterDto.sex });
        }

        // Adiciona a ordenação com base no campo 'registerDate'
        if (filterDto.order && (filterDto.order.toUpperCase() === 'ASC' || filterDto.order.toUpperCase() === 'DESC')) {
            queryBuilder.addOrderBy('animal.registerDate', filterDto.order as 'ASC' | 'DESC');
        }

        return queryBuilder.getMany();
    }

}
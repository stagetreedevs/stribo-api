import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reproductive } from './reproductive.entity';
import { Between, Repository } from 'typeorm';
import { AnimalService } from '../animal/animal.service';
import { Not } from 'typeorm';
import { FilterReproductiveDto } from './reproductive.dto';
import { Animal } from '../animal/animal.entity';

export type Status = 'A realizar' | 'Realizado' | 'Em atraso';
type AnimalInfo = {
  name: string;
  registerNumber: string;
  photo: string;
};

export type ReproductiveInfo = {
  id: string;
  procedure_name: string;
  situation: string;
  animal_id: string;
  animal_name: string;
  register_number: string;
  date: Date;
  status: string;
};

export type ReproductiveSimpleInfo = {
  id: string;
  procedure_name: string;
  situation: string;
  date: Date;
  status: string;
  animal_id: string;
};

export type AnimalReproductives = AnimalInfo & {
  reproductives: ReproductiveSimpleInfo[];
};

@Injectable()
export class ReproductiveService {
  constructor(
    @InjectRepository(Reproductive)
    private readonly reproductive: Repository<Reproductive>,
    private readonly animalService: AnimalService,
  ) {}

  async create(body: Reproductive): Promise<Reproductive> {
    const animal = await this.animalService.findOne(body.animal_id);

    const notFound = !animal;

    if (notFound) {
      throw new ForbiddenException('Animal or/and procedure not found');
    }

    return await this.reproductive.save(body);
  }

  async findById(
    id: string,
  ): Promise<Reproductive & { compatible_mares: AnimalInfo[] }> {
    let resproductive: Reproductive | (Reproductive & { animal: AnimalInfo }) =
      await this.reproductive.findOne({ where: { id } });

    if (!resproductive) {
      throw new ForbiddenException('Reproductive not found');
    }

    const animal = await this.animalService.findOne(resproductive.animal_id);

    resproductive = {
      ...resproductive,
      animal: {
        name: animal.name,
        registerNumber: animal.registerNumber,
        photo: animal.photo,
      },
    };

    if (resproductive.situation) {
      const compatible_resproductives = await this.reproductive.find({
        where: {
          situation: resproductive.situation,
          id: Not(id),
          animal_id: Not(resproductive.animal_id),
        },
      });

      if (compatible_resproductives.length === 0) {
        return {
          ...resproductive,
          compatible_mares: [],
        };
      }

      const compatible_mares = await Promise.all(
        compatible_resproductives.map(
          async (resproductive) =>
            await this.animalService.findOne(resproductive.animal_id),
        ),
      );

      if (compatible_mares.length === 0) {
        return {
          ...resproductive,
          compatible_mares: [],
        };
      }

      return {
        ...resproductive,
        compatible_mares: compatible_mares.map((mare) => ({
          id: mare.id,
          name: mare.name,
          registerNumber: mare.registerNumber,
          photo: mare.photo,
        })),
      };
    } else {
      return {
        ...resproductive,
        compatible_mares: [],
      };
    }
  }

  async findAll(): Promise<ReproductiveInfo[]> {
    const reproductives = await this.reproductive.find({
      order: { date: 'DESC' },
    });
    const animais: Animal[] = [];
    return await Promise.all(
      reproductives.map(async (reproductive) => {
        if (!animais.find((animal) => animal.id === reproductive.animal_id)) {
          animais.push(
            await this.animalService.findOne(reproductive.animal_id),
          );
        }

        const animal = animais.find(
          (animal) => animal.id === reproductive.animal_id,
        );

        return {
          id: reproductive.id,
          procedure_name: reproductive.procedure_name,
          situation: reproductive.situation,
          animal_id: reproductive.animal_id,
          animal_name: animal.name,
          register_number: animal.registerNumber,
          date: reproductive.date,
          status: reproductive.status,
        };
      }),
    );
  }

  async update(id: string, body: Reproductive): Promise<Reproductive> {
    const reproductive = await this.reproductive.findOne({ where: { id } });

    if (!reproductive) {
      throw new ForbiddenException('Reproductive not found');
    }

    const animal = await this.animalService.findOne(body.animal_id);

    const notFound = !animal;

    if (notFound) {
      throw new ForbiddenException('Animal or/and procedure not found');
    }

    return await this.reproductive.save({
      ...body,
      id,
    });
  }

  async updateStatus(id: string, status: Status): Promise<Reproductive> {
    const reproductive = await this.reproductive.findOne({ where: { id } });

    if (!reproductive) {
      throw new ForbiddenException('Reproductive not found');
    }

    return await this.reproductive.save({
      ...reproductive,
      status,
    });
  }

  async findByDate(
    date: Date,
    layout: 'procedures' | 'animals',
  ): Promise<AnimalReproductives[] | ReproductiveInfo[]> {
    if (layout === 'procedures') {
      console.log(date);
      const reproductives = await this.reproductive.find({
        where: {
          date: Between(
            new Date(date.setHours(0, 0, 0, 0)),
            new Date(date.setHours(23, 59, 59, 999)),
          ),
        },
        order: { date: 'DESC' },
      });

      const animais: Animal[] = [];

      return await Promise.all(
        reproductives.map(async (reproductive) => {
          if (!animais.find((animal) => animal.id === reproductive.animal_id)) {
            animais.push(
              await this.animalService.findOne(reproductive.animal_id),
            );
          }

          const animal = animais.find(
            (animal) => animal.id === reproductive.animal_id,
          );

          return {
            id: reproductive.id,
            procedure_name: reproductive.procedure_name,
            situation: reproductive.situation,
            animal_id: reproductive.animal_id,
            animal_name: animal.name,
            register_number: animal.registerNumber,
            date: reproductive.date,
            status: reproductive.status,
          };
        }),
      );
    } else {
      let reproductives: Reproductive[] | ReproductiveSimpleInfo[] =
        await this.reproductive.find({
          where: {
            date: Between(
              new Date(date.setHours(0, 0, 0, 0)),
              new Date(date.setHours(23, 59, 59, 999)),
            ),
          },
          order: { date: 'DESC' },
        });

      reproductives = reproductives.map((reproductive) => ({
        id: reproductive.id,
        procedure_name: reproductive.procedure_name,
        situation: reproductive.situation,
        date: reproductive.date,
        status: reproductive.status,
        animal_id: reproductive.animal_id,
      }));

      const animals = await this.animalService.findAll();

      const animalsWithReproductives = animals.map((animal) => {
        const animalReproductives = reproductives.filter(
          (reproductive) => reproductive.animal_id === animal.id,
        );

        if (animalReproductives.length === 0) {
          return;
        }

        return {
          name: animal.name,
          registerNumber: animal.registerNumber,
          photo: animal.photo,
          reproductives: animalReproductives,
        };
      });

      return animalsWithReproductives.filter((animal) => animal !== undefined);
    }
  }

  async filter(filter: FilterReproductiveDto): Promise<Reproductive[]> {
    const { procedure_name, status, responsible, start_date, end_date, order } =
      filter;

    const reproductives = await this.reproductive.find({
      where: {
        procedure_name: procedure_name ? procedure_name : undefined,
        status: status ? status : undefined,
        responsible: responsible ? responsible : undefined,
        date:
          start_date && end_date ? Between(start_date, end_date) : undefined,
      },
      order: {
        date: order,
      },
    });

    return reproductives;
  }

  async delete(id: string): Promise<void> {
    const reproductive = await this.reproductive.findOne({ where: { id } });

    if (!reproductive) {
      throw new ForbiddenException('Reproductive not found');
    }

    await this.reproductive.delete(id);
  }
}

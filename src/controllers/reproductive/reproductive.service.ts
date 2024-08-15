import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reproductive } from './reproductive.entity';
import { Repository } from 'typeorm';
import { AnimalService } from '../animal/animal.service';
import { ProcedureService } from '../procedure/procedure.service';
import { Animal } from '../animal/animal.entity';
import { Not } from 'typeorm';

@Injectable()
export class ReproductiveService {
  constructor(
    @InjectRepository(Reproductive)
    private readonly reproductive: Repository<Reproductive>,
    private readonly animalService: AnimalService,
    private readonly procedureService: ProcedureService,
  ) {}

  async create(body: Reproductive): Promise<Reproductive> {
    const animal = await this.animalService.findOne(body.animal_id);
    const procedure = await this.procedureService.findOne(body.procedure_id);
    const returnProcedure = await this.procedureService.findOne(
      body.return_procedure_id,
    );

    const notFound = !animal || !procedure || !returnProcedure;

    if (notFound) {
      throw new ForbiddenException('Animal or/and procedure not found');
    }

    return await this.reproductive.save(body);
  }

  async findOne(
    id: string,
  ): Promise<Reproductive & { compatible_mares: Animal[] }> {
    let resproductive: Reproductive | (Reproductive & { animal: Animal }) =
      await this.reproductive.findOne({ where: { id } });

    if (!resproductive) {
      throw new ForbiddenException('Reproductive not found');
    }

    const animal = await this.animalService.findOne(resproductive.animal_id);

    resproductive = {
      ...resproductive,
      animal,
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
        compatible_mares,
      };
    } else {
      return {
        ...resproductive,
        compatible_mares: [],
      };
    }
  }

  async update(id: string, body: Reproductive): Promise<Reproductive> {
    const reproductive = await this.reproductive.findOne({ where: { id } });

    if (!reproductive) {
      throw new ForbiddenException('Reproductive not found');
    }

    const animal = await this.animalService.findOne(body.animal_id);
    const procedure = await this.procedureService.findOne(body.procedure_id);
    const returnProcedure = await this.procedureService.findOne(
      body.return_procedure_id,
    );

    const notFound = !animal || !procedure || !returnProcedure;

    if (notFound) {
      throw new ForbiddenException('Animal or/and procedure not found');
    }

    return await this.reproductive.save({
      ...body,
      status: reproductive.status,
      id,
    });
  }

  async delete(id: string): Promise<void> {
    const reproductive = await this.reproductive.findOne({ where: { id } });

    if (!reproductive) {
      throw new ForbiddenException('Reproductive not found');
    }

    await this.reproductive.delete(id);
  }
}

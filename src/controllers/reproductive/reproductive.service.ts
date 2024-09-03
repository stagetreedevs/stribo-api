import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reproductive } from './reproductive.entity';
import { Equal, LessThan, MoreThan, Repository } from 'typeorm';
import { AnimalService } from '../animal/animal.service';
import { FilterProcedureDto } from './reproductive.dto';

export type Status = 'A realizar' | 'Realizado' | 'Em atraso';

@Injectable()
export class ReproductiveService {
  constructor(
    @InjectRepository(Reproductive)
    private readonly reproductive: Repository<Reproductive>,
    private readonly animalService: AnimalService,
  ) {}

  async create(body: Reproductive): Promise<Reproductive> {
    return await this.reproductive.save(body);
  }

  async findOne(id: string): Promise<Reproductive> {
    return await this.reproductive.findOne({ where: { id } });
  }

  async findByAnimal(animal_id: string): Promise<Reproductive[]> {
    return this.reproductive.find({ where: { animal_id } });
  }

  async findAll(): Promise<Reproductive[]> {
    return this.reproductive.find();
  }

  async findAndProcessProcedures(animal_id: string): Promise<any[]> {
    const procedures: Reproductive[] = await this.findByAnimal(animal_id);
    return await this.formattedDate(procedures);
  }

  async formattedDate(procedures: Reproductive[]): Promise<any[]> {
    const currentDate = new Date();
    const formattedCurrentDate = this.formatDate(currentDate);

    const processedProcedures = procedures.reduce((acc, procedure) => {
      const formattedProcedureDate = this.formatStringDate(
        procedure.date.toString(),
      );
      const isToday = formattedProcedureDate === formattedCurrentDate;
      const dateLabel = isToday
        ? `${formattedCurrentDate} (HOJE)`
        : formattedProcedureDate;
      const existingDateIndex = acc.findIndex(
        (item) => item.date === dateLabel,
      );
      if (existingDateIndex !== -1) {
        acc[existingDateIndex].procedures.push({
          id: procedure.id,
          procedure: procedure.procedure,
          obs:
            procedure.observation !== null
              ? procedure.observation
              : 'Nenhuma observação',
          hour: procedure.hour !== null ? procedure.hour : 'Nenhuma hora',
        });
      } else {
        acc.push({
          date: dateLabel,
          procedures: [
            {
              id: procedure.id,
              status: procedure.status,
              procedure: procedure.procedure,
              obs:
                procedure.observation !== null
                  ? procedure.observation
                  : 'Nenhuma observação',
              hour: procedure.hour !== null ? procedure.hour : 'Nenhuma hora',
            },
          ],
        });
      }

      return acc;
    }, []);

    return processedProcedures;
  }

  formatStringDate(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  async findProcedureByAnimal(property: string): Promise<any[]> {
    const procedimentos = await this.reproductive.find({ where: { property } });
    const result: any[] = [];
    for (const procedimento of procedimentos) {
      const animal = await this.animalService.findOne(procedimento.animal_id);
      const body = { ...procedimento, animal_photo: animal.photo };
      result.push(body);
    }

    return await this.formattedResponseAnimal(result);
  }

  async formattedResponseAnimal(procedimentos): Promise<any[]> {
    const result: any[] = [];

    const procedimentosPorAnimal = {};
    for (const procedimento of procedimentos) {
      if (!procedimentosPorAnimal[procedimento.animal_id]) {
        procedimentosPorAnimal[procedimento.animal_id] = {
          animal_name: procedimento.animal_name,
          animal_photo: procedimento.animal_photo,
          animal_registry: procedimento.animal_registry,
          procedures: [],
        };
      }
      procedimentosPorAnimal[procedimento.animal_id].procedures.push({
        date: procedimento.date,
        procedure: procedimento.procedure_name,
        status: procedimento.status,
        obs: procedimento.observation,
        hour: procedimento.hour,
      });
    }

    for (const animalId in procedimentosPorAnimal) {
      result.push(procedimentosPorAnimal[animalId]);
    }

    return result;
  }

  async findByProperty(property: string): Promise<any[]> {
    const procedimentos = await this.reproductive.find({ where: { property } });
    const result: any[] = [];
    for (const procedimento of procedimentos) {
      const animal = await this.animalService.findOne(procedimento.animal_id);
      const body = { ...procedimento, animal_photo: animal.photo };
      result.push(body);
    }

    return await this.formattedDate(result);
  }

  async findAllProcedureNames(property: string): Promise<string[]> {
    const procedimentos = await this.reproductive.find({ where: { property } });
    const uniqueNames = new Set<string>();

    procedimentos.forEach((procedimento) => {
      uniqueNames.add(procedimento.procedure);
    });

    return Array.from(uniqueNames);
  }

  async findTodayProcedure(property: string): Promise<any[]> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const procedimentos = await this.reproductive.find({
      where: {
        property,
        date: Equal(currentDate),
      },
    });
    const result: any[] = [];
    for (const procedimento of procedimentos) {
      const animal = await this.animalService.findOne(procedimento.animal_id);
      const body = { ...procedimento, animal_photo: animal.photo };
      result.push(body);
    }

    return await this.formattedDate(result);
  }

  async findPastProcedures(property: string): Promise<any[]> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const procedimentos = await this.reproductive.find({
      where: {
        property,
        date: LessThan(currentDate),
      },
    });
    const result: any[] = [];
    for (const procedimento of procedimentos) {
      const animal = await this.animalService.findOne(procedimento.animal_id);
      const body = { ...procedimento, animal_photo: animal.photo };
      result.push(body);
    }

    return await this.formattedDate(result);
  }

  async findFutureProcedures(property: string): Promise<any[]> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const procedimentos = await this.reproductive.find({
      where: {
        property,
        date: MoreThan(currentDate),
      },
    });
    const result: any[] = [];
    for (const procedimento of procedimentos) {
      const animal = await this.animalService.findOne(procedimento.animal_id);
      const body = { ...procedimento, animal_photo: animal.photo };
      result.push(body);
    }

    return await this.formattedDate(result);
  }

  async updateStatus(id: string, status: string): Promise<any> {
    const procedimento = await this.findOne(id);

    if (!procedimento) {
      throw new HttpException(
        'Procedimento nao encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.reproductive
      .createQueryBuilder()
      .update(Reproductive)
      .set({ status })
      .where('id = :id', { id })
      .execute();

    return await this.findOne(id);
  }

  async update(id: string, body: any): Promise<Reproductive> {
    const verify = await this.findOne(id);

    if (!verify) {
      throw new HttpException(
        'Procedimento nao encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    body.property = verify.property;

    await this.reproductive.update(id, body);
    return this.findOne(id);
  }

  async removeProcedure(id: string): Promise<void> {
    const verify = await this.findOne(id);
    if (!verify) {
      throw new HttpException(
        'Procedimento nao encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.reproductive.delete(id);
  }

  async findFiltered(body: FilterProcedureDto): Promise<Reproductive[]> {
    const queryBuilder = this.reproductive.createQueryBuilder('procedure');

    if (body.initialDate) {
      queryBuilder.andWhere('procedure.date >= :initialDate', {
        initialDate: body.initialDate,
      });
    }

    if (body.lastDate) {
      queryBuilder.andWhere('procedure.date <= :lastDate', {
        lastDate: body.lastDate,
      });
    }

    if (body.procedure) {
      queryBuilder.andWhere('procedure.procedure ILIKE :procedure', {
        procedure: `%${body.procedure}%`,
      });
    }

    if (body.responsible) {
      queryBuilder.andWhere('procedure.responsible = :responsible', {
        responsible: body.responsible,
      });
    }

    if (body.status) {
      queryBuilder.andWhere('procedure.status = :status', {
        status: body.status,
      });
    }

    if (
      body.order &&
      (body.order.toUpperCase() === 'ASC' ||
        body.order.toUpperCase() === 'DESC')
    ) {
      queryBuilder.addOrderBy('procedure.date', body.order as 'ASC' | 'DESC');
    }

    return queryBuilder.getMany();
  }
}

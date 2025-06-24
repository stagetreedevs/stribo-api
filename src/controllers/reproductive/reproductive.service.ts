import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reproductive } from './reproductive.entity';
import {
  And,
  Between,
  Equal,
  FindOperator,
  LessThan,
  Like,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { AnimalService } from '../animal/animal.service';
import { SemenShippingService } from '../semen-shipping/semen-shipping.service';
import { SemenFrozenService } from '../semen-frozen/semen-frozen.service';
import { SemenReceiptService } from '../semen-receipt/semen-receipt.service';
import { CylinderService } from '../cylinder/cylinder.service';
import { FilterProcedureDto } from './reproductive.dto';
import { Animal } from '../animal/animal.entity';
import { OneSignalService } from '../../services/one-signal/one-signal.service';

export type Status = 'A Realizar' | 'Realizado' | 'Em atraso';

@Injectable()
export class ReproductiveService {
  constructor(
    @InjectRepository(Reproductive)
    private readonly reproductive: Repository<Reproductive>,
    private readonly animalService: AnimalService,
    private readonly semenShippingService: SemenShippingService,
    private readonly semenFrozenService: SemenFrozenService,
    private readonly semenReceiptService: SemenReceiptService,
    private readonly cylinderService: CylinderService,
    private readonly oneSignalService: OneSignalService,
  ) {}

  async create(body: Reproductive): Promise<Reproductive> {
    const procedure = await this.reproductive.save(body);

    if (!procedure) {
      throw new HttpException(
        'Erro ao criar procedimento',
        HttpStatus.BAD_REQUEST,
      );
    }

    const date = procedure.date; // 2024-11-19
    const hour = procedure.hour; // 10h00

    const [hourPart, minutePart] = hour.split('h').map(Number);
    const procedureDateTime = new Date(date);

    procedureDateTime.setHours(hourPart, minutePart, 0, 0);

    const notificationDate = new Date(procedureDateTime);
    notificationDate.setHours(notificationDate.getHours() - 8);

    await this.oneSignalService.sendNotification(
      procedure.property,
      `Procedimento de reprodução agendado para ${procedure.animal_name} (${procedure.animal_registry})`,
      `O procedimento de reprodução ${
        procedure.procedure
      } está agendado para ${procedureDateTime.toLocaleDateString(
        'pt-BR',
      )} às ${procedureDateTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })}.`,
      notificationDate.getTime() < new Date().getTime()
        ? null
        : notificationDate,
    );

    return procedure;
  }

  async findOne(id: string): Promise<Reproductive & { animal_photo: string }> {
    const reproductive = await this.reproductive.findOne({ where: { id } });

    const animal = await this.animalService.findOne(reproductive.animal_id);

    return { ...reproductive, animal_photo: animal.photo };
  }

  async findByAnimal(animal_id: string): Promise<Reproductive[]> {
    return this.reproductive.find({ where: { animal_id } });
  }

  async getManagementList(property: string): Promise<any> {
    const quantityReceipt = await this.semenReceiptService.getQuantity(
      property,
    );

    const quantityFrozen = await this.semenFrozenService.getQuantity(property);

    const quantityShipping = await this.semenShippingService.getQuantity(
      property,
    );

    const quantityCylinder = await this.cylinderService.getQuantity(property);

    return {
      quantityReceipt,
      quantityFrozen,
      quantityShipping,
      quantityCylinder,
    };
  }

  async findAll(property_id: string, query?: FilterProcedureDto): Promise<any> {
    const reproductivesToday = await this.findTodayProcedure(
      property_id,
      query,
    );
    const reproductivesPast = await this.findPastProcedures(property_id, query);
    const reproductivesFuture = await this.findFutureProcedures(
      property_id,
      query,
    );

    return {
      today: reproductivesToday,
      past: reproductivesPast,
      future: reproductivesFuture,
    };
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
          status: procedure.status,
          procedure: procedure.procedure,
          obs:
            procedure.observation !== null
              ? procedure.observation
              : 'Nenhuma observação',
          hour: procedure.hour !== null ? procedure.hour : 'Nenhuma hora',
          animal_id: procedure.animal_id,
          animal_registry: procedure.animal_registry,
          animal_name: procedure.animal_name,
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
              animal_id: procedure.animal_id,
              animal_registry: procedure.animal_registry,
              animal_name: procedure.animal_name,
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

  // TODO: Implementar
  //async findAnimalsCompatible() {}

  async findProcedureByAnimal(
    property: string,
    time: 'today' | 'past' | 'future' | 'all',
  ): Promise<any[]> {
    let procedimentos: Reproductive[] = [];

    if (time === 'today') {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      procedimentos = await this.reproductive.find({
        where: {
          property,
          date: Equal(currentDate),
        },
      });
    } else if (time === 'past') {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      procedimentos = await this.reproductive.find({
        where: {
          property,
          date: LessThan(currentDate),
        },
      });
    } else if (time === 'future') {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      procedimentos = await this.reproductive.find({
        where: {
          property,
          date: MoreThan(currentDate),
        },
      });
    } else {
      procedimentos = await this.reproductive.find({ where: { property } });
    }

    const result: Array<Reproductive & { animal_photo: string }> = [];
    for (const procedimento of procedimentos) {
      const animal = await this.animalService.findOne(procedimento.animal_id);
      const body = { ...procedimento, animal_photo: animal.photo };
      result.push(body);
    }

    return await this.formattedResponseAnimal(result);
  }

  async formattedResponseAnimal(
    procedimentos: Array<Reproductive & { animal_photo: string }>,
  ): Promise<any[]> {
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
        id: procedimento.id,
        date: procedimento.date,
        procedure: procedimento.procedure,
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

  async findTodayProcedure(
    property: string,
    query?: FilterProcedureDto,
  ): Promise<any[]> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const dateCondition: FindOperator<Date> =
      query?.initialDate && query?.lastDate
        ? And(
            Between(
              new Date(query?.initialDate.setHours(0, 0, 0, 0)),
              new Date(query?.lastDate.setHours(23, 59, 59, 999)),
            ),
            Equal(currentDate),
          )
        : Equal(currentDate);

    const procedimentos = await this.reproductive.find({
      where: {
        property,
        animal_name: query?.search ? Like(`%${query.search}%`) : undefined,
        procedure: query?.procedure || undefined,
        date: dateCondition,
        responsible: query?.responsible || undefined,
        status: query?.status || undefined,
      },
      order: {
        date: query?.order || 'DESC',
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

  async findPastProcedures(
    property: string,
    query?: FilterProcedureDto,
  ): Promise<any[]> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const dateCondition: FindOperator<Date> =
      query?.initialDate && query?.lastDate
        ? And(
            Between(
              new Date(query.initialDate.setHours(0, 0, 0, 0)),
              new Date(query.lastDate.setHours(23, 59, 59, 999)),
            ),
            LessThan(currentDate),
          )
        : LessThan(currentDate);

    const procedimentos = await this.reproductive.find({
      where: {
        property,
        animal_name: query?.search ? Like(`%${query.search}%`) : undefined,
        procedure: query?.procedure || undefined,
        date: dateCondition,
        responsible: query?.responsible || undefined,
        status: query?.status || undefined,
      },
      order: {
        date: query?.order || 'DESC',
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

  async findFutureProcedures(
    property: string,
    query?: FilterProcedureDto,
  ): Promise<any[]> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const dateCondition: FindOperator<Date> =
      query?.initialDate && query?.lastDate
        ? And(
            Between(
              new Date(query?.initialDate.setHours(0, 0, 0, 0)),
              new Date(query?.lastDate.setHours(23, 59, 59, 999)),
            ),
            MoreThan(currentDate),
          )
        : MoreThan(currentDate);

    const procedimentos = await this.reproductive.find({
      where: {
        property,
        animal_name: query?.search ? Like(`%${query.search}%`) : undefined,
        procedure: query?.procedure || undefined,
        date: dateCondition,
        responsible: query?.responsible || undefined,
        status: query?.status || undefined,
      },
      order: {
        date: query?.order || 'DESC',
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

  async getMaresCompatible(property_id: string) {
    let reproductives = await this.reproductive.find({
      where: {
        mare_type: 'Receptora',
        property: property_id,
      },
      order: {
        date: 'DESC',
      },
    });

    reproductives = reproductives.filter((reproductive) => {
      let numInvalid = 0;

      if (reproductive.corpus_luteum === 'Não favorável') {
        numInvalid += 1;
      }

      if (reproductive.uterine_edema === 'Não favorável') {
        numInvalid += 1;
      }

      if (reproductive.uterine_tone === 'Não favorável') {
        numInvalid += 1;
      }

      if (numInvalid > 1) {
        return false;
      }

      return true;
    });

    const animals: Animal[] = [];

    for (const reproductive of reproductives) {
      const isAddAnimal = animals.find(
        (animal) => animal.id === reproductive.animal_id,
      );

      if (!isAddAnimal) {
        const animal = await this.animalService.findOne(reproductive.animal_id);
        animals.push(animal);
      }
    }

    return animals;
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

  async deleteAll(): Promise<void> {
    await this.reproductive.delete({});
  }
}

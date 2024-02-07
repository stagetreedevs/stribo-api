/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, LessThan, MoreThan, Repository } from 'typeorm';
import { Procedure } from './procedure.entity';
import { FilterProcedureDto } from './procedure.dto';
import { AnimalService } from '../animal/animal.service';
@Injectable()
export class ProcedureService {
    constructor(
        @InjectRepository(Procedure) private readonly procedimento: Repository<Procedure>,
        private readonly animalService: AnimalService
    ) { }

    async create(body: Procedure): Promise<Procedure> {
        return await this.procedimento.save(body);
    }

    async findAll(): Promise<Procedure[]> {
        return this.procedimento.find();
    }

    async findOne(id: string): Promise<Procedure> {
        return await this.procedimento.findOne({ where: { id } });
    }

    async findByAnimal(animal_id: string): Promise<Procedure[]> {
        return this.procedimento.find({ where: { animal_id } });
    }

    async findByProperty(property: string): Promise<any[]> {
        const procedimentos = await this.procedimento.find({ where: { property } });
        const result: any[] = [];
        for (const procedimento of procedimentos) {
            const animal = await this.animalService.findOne(procedimento.animal_id);
            const body = { ...procedimento, animal_photo: animal.photo }
            result.push(body);
        }

        return result;
    }

    async findAllProcedureNames(property: string): Promise<string[]> {
        const procedimentos = await this.procedimento.find({ where: { property } });
        const uniqueNames = new Set<string>();

        procedimentos.forEach((procedimento) => {
            uniqueNames.add(procedimento.procedure);
        });

        return Array.from(uniqueNames);
    }

    async findTodayProcedure(property: string): Promise<any[]> {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const procedimentos = await this.procedimento.find({
            where: {
                property,
                date: Equal(currentDate),
            },
        });
        const result: any[] = [];
        for (const procedimento of procedimentos) {
            const animal = await this.animalService.findOne(procedimento.animal_id);
            const body = { ...procedimento, animal_photo: animal.photo }
            result.push(body);
        }

        return result;
    }

    async findPastProcedures(property: string): Promise<any[]> {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const procedimentos = await this.procedimento.find({
            where: {
                property,
                date: LessThan(currentDate),
            },
        });
        const result: any[] = [];
        for (const procedimento of procedimentos) {
            const animal = await this.animalService.findOne(procedimento.animal_id);
            const body = { ...procedimento, animal_photo: animal.photo }
            result.push(body);
        }

        return result;
    }

    async findFutureProcedures(property: string): Promise<any[]> {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const procedimentos = await this.procedimento.find({
            where: {
                property,
                date: MoreThan(currentDate),
            },
        });
        const result: any[] = [];
        for (const procedimento of procedimentos) {
            const animal = await this.animalService.findOne(procedimento.animal_id);
            const body = { ...procedimento, animal_photo: animal.photo }
            result.push(body);
        }

        return result;
    }

    async updateStatus(id: string, status: string): Promise<any> {
        const procedimento = await this.findOne(id);

        if (!procedimento) {
            throw new HttpException('Procedimento nao encontrado', HttpStatus.BAD_REQUEST);
        }

        await this.procedimento
            .createQueryBuilder()
            .update(Procedure)
            .set({ status })
            .where("id = :id", { id })
            .execute();

        return await this.findOne(id);
    }

    async update(id: string, body: any): Promise<Procedure> {
        const verify = await this.findOne(id);

        if (!verify) {
            throw new HttpException('Procedimento nao encontrado', HttpStatus.BAD_REQUEST);
        }

        body.property = verify.property;

        await this.procedimento.update(id, body);
        return this.findOne(id);
    }

    async removeProcedure(id: string): Promise<void> {
        const verify = await this.findOne(id);
        if (!verify) {
            throw new HttpException('Procedimento nao encontrado', HttpStatus.BAD_REQUEST);
        }
        await this.procedimento.delete(id);
    }

    async findFiltered(body: FilterProcedureDto): Promise<Procedure[]> {
        const queryBuilder = this.procedimento.createQueryBuilder('procedure');

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
            queryBuilder.andWhere('procedure.procedure ILIKE :procedure', { procedure: `%${body.procedure}%` });
        }

        if (body.responsible) {
            queryBuilder.andWhere('procedure.responsible = :responsible', { responsible: body.responsible });
        }

        if (body.status) {
            queryBuilder.andWhere('procedure.status = :status', { status: body.status });
        }

        if (body.order && (body.order.toUpperCase() === 'ASC' || body.order.toUpperCase() === 'DESC')) {
            queryBuilder.addOrderBy('procedure.date', body.order as 'ASC' | 'DESC');
        }

        return queryBuilder.getMany();
    }

}
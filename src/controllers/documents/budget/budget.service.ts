/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
@Injectable()
export class BudgetService {
    constructor(
        @InjectRepository(Budget) private readonly budgetRepository: Repository<Budget>
    ) { }

    async create(body: any): Promise<any> {
        return await this.budgetRepository.save(body);
    }

    async findByNumber(budget_number: string): Promise<any> {
        return await this.budgetRepository.findOne({ where: { budget_number } });
    }

    async findByProperty(property: string): Promise<any> {
        return this.budgetRepository.find({ where: { property } });
    }

    async findAll(): Promise<any> {
        return this.budgetRepository.find();
    }

    async update(budget_number: string, body: any): Promise<any> {
        const verify = await this.findByNumber(budget_number);

        if (!verify) {
            throw new HttpException('Orcamento nao encontrado', HttpStatus.BAD_REQUEST);
        }

        body.budget_number = verify.budget_number;
        body.property = verify.property;

        await this.budgetRepository.update(budget_number, body);
        return this.findByNumber(budget_number);
    }

    async delete(budget_number: string): Promise<void> {
        await this.budgetRepository.delete(budget_number);
    }

}
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { FilterDocumentsDto } from '../documents.dto';
@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>
    ) { }

    async create(body: any): Promise<any> {
        return await this.invoiceRepository.save(body);
    }

    async findByNumber(invoice_number: string): Promise<any> {
        return await this.invoiceRepository.findOne({ where: { invoice_number } });
    }

    async findByProperty(property: string): Promise<any> {
        return this.invoiceRepository.find({ where: { property } });
    }

    async findAll(): Promise<any> {
        return this.invoiceRepository.find();
    }

    async findFiltered(body: FilterDocumentsDto): Promise<any[]> {
        const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');

        if (body.initialDate) {
            queryBuilder.andWhere('invoice.date >= :initialDate', {
                initialDate: body.initialDate,
            });
        }

        if (body.lastDate) {
            queryBuilder.andWhere('invoice.date <= :lastDate', {
                lastDate: body.lastDate,
            });
        }

        if (body.provider) {
            queryBuilder.andWhere('invoice.provider = :provider', { provider: body.provider });
        }

        if (body.order && (body.order.toUpperCase() === 'ASC' || body.order.toUpperCase() === 'DESC')) {
            queryBuilder.addOrderBy('invoice.date', body.order as 'ASC' | 'DESC');
        }

        return queryBuilder.getMany();
    }

    async update(invoice_number: string, body: any): Promise<any> {
        const verify = await this.findByNumber(invoice_number);

        if (!verify) {
            throw new HttpException('Nota fiscal nao encontrada', HttpStatus.BAD_REQUEST);
        }

        body.invoice_number = verify.invoice_number;
        body.property = verify.property;

        await this.invoiceRepository.update(invoice_number, body);
        return this.findByNumber(invoice_number);
    }

    async delete(invoice_number: string): Promise<void> {
        await this.invoiceRepository.delete(invoice_number);
    }

}
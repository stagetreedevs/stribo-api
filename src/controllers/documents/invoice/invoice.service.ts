/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
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
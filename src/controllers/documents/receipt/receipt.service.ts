/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './receipt.entity';
import { FilterDocumentsDto } from '../documents.dto';
@Injectable()
export class ReceiptService {
    constructor(
        @InjectRepository(Receipt) private readonly receiptRepository: Repository<Receipt>
    ) { }

    async create(body: any): Promise<any> {
        return await this.receiptRepository.save(body);
    }

    async findByNumber(receipt_number: string): Promise<any> {
        return await this.receiptRepository.findOne({ where: { receipt_number } });
    }

    async findByProperty(property: string): Promise<any> {
        return this.receiptRepository.find({ where: { property } });
    }

    async findAll(): Promise<any> {
        return this.receiptRepository.find();
    }

    async findFiltered(body: FilterDocumentsDto): Promise<any[]> {
        const queryBuilder = this.receiptRepository.createQueryBuilder('receipt');
    
        if (body.initialDate) {
            queryBuilder.andWhere('receipt.date >= :initialDate', {
                initialDate: body.initialDate,
            });
        }
    
        if (body.lastDate) {
            queryBuilder.andWhere('receipt.date <= :lastDate', {
                lastDate: body.lastDate,
            });
        }
    
        if (body.provider) {
            queryBuilder.andWhere('receipt.provider = :provider', { provider: body.provider });
        }
    
        if (body.order && (body.order.toUpperCase() === 'ASC' || body.order.toUpperCase() === 'DESC')) {
            queryBuilder.addOrderBy('receipt.date', body.order as 'ASC' | 'DESC');
        }
    
        return queryBuilder.getMany();
    }

    async update(receipt_number: string, body: any): Promise<any> {
        const verify = await this.findByNumber(receipt_number);

        if (!verify) {
            throw new HttpException('Recibo nao encontrado', HttpStatus.BAD_REQUEST);
        }

        body.receipt_number = verify.receipt_number;
        body.property = verify.property;

        await this.receiptRepository.update(receipt_number, body);
        return this.findByNumber(receipt_number);
    }

    async delete(receipt_number: string): Promise<void> {
        await this.receiptRepository.delete(receipt_number);
    }

}
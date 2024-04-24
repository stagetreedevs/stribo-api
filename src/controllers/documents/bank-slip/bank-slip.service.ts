/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankSlip } from './bank-slip.entity';
import { FilterDocumentsDto } from '../documents.dto';
@Injectable()
export class BankSlipService {
    constructor(
        @InjectRepository(BankSlip) private readonly ticketRepository: Repository<BankSlip>
    ) { }

    async create(body: any): Promise<any> {
        const { payment, installments } = body;

        // Verifica se payment é true(a vista) e installments não é nulo
        if (payment && installments !== null) {
            throw new Error('Pagamento a vista não tem parcelas.');
        }

        // Verifica se payment é false(parcelado) e installments é nulo ou tem menos de 1 item
        if (!payment && (installments === null || installments.length < 1)) {
            throw new Error('Pagamento parcelado tem que ter no mínimo 2 itens.');
        }

        return await this.ticketRepository.save(body);
    }

    async findByNumber(ticket_number: string): Promise<any> {
        return await this.ticketRepository.findOne({ where: { ticket_number } });
    }

    async findByProperty(property: string): Promise<any> {
        return this.ticketRepository.find({ where: { property } });
    }

    async findAll(): Promise<any> {
        return this.ticketRepository.find();
    }

    async update(ticket_number: string, body: any): Promise<any> {
        const verify = await this.findByNumber(ticket_number);

        if (!verify) {
            throw new HttpException('Boleto não encontrado', HttpStatus.BAD_REQUEST);
        }

        const { payment, installments } = body;

        // Verifica se payment é true(a vista) e installments não é nulo
        if (payment && installments !== null) {
            throw new Error('Pagamento a vista não tem parcelas.');
        }

        // Verifica se payment é false(parcelado) e installments é nulo ou tem menos de 1 item
        if (!payment && (installments === null || installments.length < 1)) {
            throw new Error('Pagamento parcelado tem que ter no mínimo 2 itens.');
        }

        body.ticket_number = verify.ticket_number;
        body.property = verify.property;

        await this.ticketRepository.update(ticket_number, body);
        return this.findByNumber(ticket_number);
    }

    async findFiltered(body: FilterDocumentsDto): Promise<any[]> {
        const queryBuilder = this.ticketRepository.createQueryBuilder('bank-slip');
    
        if (body.initialDate) {
            queryBuilder.andWhere('bank-slip.date >= :initialDate', {
                initialDate: body.initialDate,
            });
        }
    
        if (body.lastDate) {
            queryBuilder.andWhere('bank-slip.date <= :lastDate', {
                lastDate: body.lastDate,
            });
        }
    
        if (body.provider) {
            queryBuilder.andWhere('bank-slip.provider = :provider', { provider: body.provider });
        }
    
        if (body.order && (body.order.toUpperCase() === 'ASC' || body.order.toUpperCase() === 'DESC')) {
            queryBuilder.addOrderBy('bank-slip.date', body.order as 'ASC' | 'DESC');
        }
    
        return queryBuilder.getMany();
    }

    async delete(ticket_number: string): Promise<void> {
        await this.ticketRepository.delete(ticket_number);
    }

}
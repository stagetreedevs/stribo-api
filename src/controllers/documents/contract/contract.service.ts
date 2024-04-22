/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>
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

        return await this.contractRepository.save(body);
    }

    async findByNumber(contract_number: string): Promise<any> {
        return await this.contractRepository.findOne({ where: { contract_number } });
    }

    async findByProperty(property: string): Promise<any> {
        return this.contractRepository.find({ where: { property } });
    }

    async findAll(): Promise<any> {
        return this.contractRepository.find();
    }

    async update(contract_number: string, body: any): Promise<any> {
        const verify = await this.findByNumber(contract_number);

        if (!verify) {
            throw new HttpException('Contrato não encontrado', HttpStatus.BAD_REQUEST);
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

        body.contract_number = verify.contract_number;
        body.property = verify.property;

        await this.contractRepository.update(contract_number, body);
        return this.findByNumber(contract_number);
    }

    async delete(contract_number: string): Promise<void> {
        await this.contractRepository.delete(contract_number);
    }

}
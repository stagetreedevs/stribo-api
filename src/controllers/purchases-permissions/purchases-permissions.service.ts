/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchasesPermissionsEditDto } from './purchases-permissions.dto';
import { PurchasesPermissions } from './purchases-permissions.entity';
@Injectable()
export class PurchasesPermissionsService {
    constructor(
        @InjectRepository(PurchasesPermissions) private readonly permissions: Repository<PurchasesPermissions>
    ) { }

    async create(body: PurchasesPermissions): Promise<PurchasesPermissions> {
        const verify = await this.findByUsername(body.username);

        if (verify) {
            throw new HttpException('Permissões já cadastradas', HttpStatus.BAD_REQUEST);
        }

        return await this.permissions.save(body);
    }

    async findOne(id: string): Promise<PurchasesPermissions> {
        const verify = await this.permissions.findOne({ where: { id } });
        return verify;
    }

    async findAll(): Promise<PurchasesPermissions[]> {
        return this.permissions.find();
    }

    async findByUsername(username: string): Promise<PurchasesPermissions> {
        return this.permissions.findOne({ where: { username } });
    }

    async update(username: string, body: PurchasesPermissionsEditDto): Promise<PurchasesPermissions> {
        const verify = await this.findByUsername(username);

        if (!verify) {
            throw new HttpException('Permissões não encontradas', HttpStatus.BAD_REQUEST);
        }

        verify.itens = body.itens;
        verify.orcamentos = body.orcamentos;
        verify.parcelas = body.parcelas;
        verify.notas = body.notas;
        verify.estoque = body.estoque;

        await this.permissions.update(verify.id, verify);
        return this.findOne(verify.id);
    }

    async remove(id: string): Promise<void> {
        const verify = await this.findOne(id);
        if (!verify) {
            throw new HttpException('Permissões nao encontradas', HttpStatus.BAD_REQUEST);
        }
        await this.permissions.delete(id);
    }

}
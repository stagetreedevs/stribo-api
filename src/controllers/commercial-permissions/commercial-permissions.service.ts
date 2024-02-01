/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommercialPermissionsEditDto } from './commercial-permissions.dto';
import { CommercialPermissions } from './commercial-permissions.entity';
@Injectable()
export class CommercialPermissionsService {
    constructor(
        @InjectRepository(CommercialPermissions) private readonly permissions: Repository<CommercialPermissions>
    ) { }

    async create(body: CommercialPermissions): Promise<CommercialPermissions> {
        const verify = await this.findByUsername(body.username);

        if (verify) {
            throw new HttpException('Permissões já cadastradas', HttpStatus.BAD_REQUEST);
        }

        return await this.permissions.save(body);
    }

    async findOne(id: string): Promise<CommercialPermissions> {
        const verify = await this.permissions.findOne({ where: { id } });
        return verify;
    }

    async findAll(): Promise<CommercialPermissions[]> {
        return this.permissions.find();
    }

    async findByUsername(username: string): Promise<CommercialPermissions> {
        return this.permissions.findOne({ where: { username } });
    }

    async update(username: string, body: CommercialPermissionsEditDto): Promise<CommercialPermissions> {
        const verify = await this.findByUsername(username);

        if (!verify) {
            throw new HttpException('Permissões não encontradas', HttpStatus.BAD_REQUEST);
        }
       
        verify.contratos = body.contratos;
        verify.vendas = body.vendas;
        verify.orcamentos = body.orcamentos;
        verify.notas = body.notas;
        verify.recibos = body.recibos;
        verify.servico = body.servico;
        verify.produtos = body.produtos;
        verify.estoque = body.estoque;
        verify.inventario = body.inventario;

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
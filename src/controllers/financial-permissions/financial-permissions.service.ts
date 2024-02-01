/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialPermissionsEditDto } from './financial-permissions.dto';
import { FinancialPermissions } from './financial-permissions.entity';
@Injectable()
export class FinancialPermissionsService {
    constructor(
        @InjectRepository(FinancialPermissions) private readonly permissions: Repository<FinancialPermissions>
    ) { }

    async create(body: FinancialPermissions): Promise<FinancialPermissions> {
        const verify = await this.findByUsername(body.username);

        if (verify) {
            throw new HttpException('Permissões já cadastradas', HttpStatus.BAD_REQUEST);
        }

        return await this.permissions.save(body);
    }

    async findOne(id: string): Promise<FinancialPermissions> {
        const verify = await this.permissions.findOne({ where: { id } });
        return verify;
    }

    async findAll(): Promise<FinancialPermissions[]> {
        return this.permissions.find();
    }

    async findByUsername(username: string): Promise<FinancialPermissions> {
        return this.permissions.findOne({ where: { username } });
    }

    async update(username: string, body: FinancialPermissionsEditDto): Promise<FinancialPermissions> {
        const verify = await this.findByUsername(username);

        if (!verify) {
            throw new HttpException('Permissões não encontradas', HttpStatus.BAD_REQUEST);
        }

        verify.caixa = body.caixa;
        verify.graficos = body.graficos;

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
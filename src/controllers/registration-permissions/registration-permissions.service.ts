/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationPermissions } from './registration-permissions.entity';
import { RegistrationPermissionsEditDto } from './registration-permissions.dto';
@Injectable()
export class RegistrationPermissionsService {
    constructor(
        @InjectRepository(RegistrationPermissions) private readonly permissions: Repository<RegistrationPermissions>
    ) { }

    async create(body: RegistrationPermissions): Promise<RegistrationPermissions> {
        const verify = await this.findByUsername(body.username);

        if (verify) {
            throw new HttpException('Permissões já cadastradas', HttpStatus.BAD_REQUEST);
        }

        return await this.permissions.save(body);
    }

    async findOne(id: string): Promise<RegistrationPermissions> {
        const verify = await this.permissions.findOne({ where: { id } });
        return verify;
    }

    async findAll(): Promise<RegistrationPermissions[]> {
        return this.permissions.find();
    }

    async findByUsername(username: string): Promise<RegistrationPermissions> {
        return this.permissions.findOne({ where: { username } });
    }

    async update(username: string, body: RegistrationPermissionsEditDto): Promise<RegistrationPermissions> {
        const verify = await this.findByUsername(username);

        if (!verify) {
            throw new HttpException('Permissões não encontradas', HttpStatus.BAD_REQUEST);
        }

        verify.clientes = body.clientes;
        verify.fornecedores = body.fornecedores;
        verify.planos = body.planos;
        verify.animal = body.animal;
        verify.propriedade = body.propriedade;

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
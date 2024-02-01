/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportPermissionsEditDto } from './sport-permissions.dto';
import { SportPermissions } from './sport-permissions.entity';
@Injectable()
export class SportPermissionsService {
    constructor(
        @InjectRepository(SportPermissions) private readonly permissions: Repository<SportPermissions>
    ) { }

    async create(body: SportPermissions): Promise<SportPermissions> {
        const verify = await this.findByUsername(body.username);

        if (verify) {
            throw new HttpException('Permissões já cadastradas', HttpStatus.BAD_REQUEST);
        }

        return await this.permissions.save(body);
    }

    async findOne(id: string): Promise<SportPermissions> {
        const verify = await this.permissions.findOne({ where: { id } });
        return verify;
    }

    async findAll(): Promise<SportPermissions[]> {
        return this.permissions.find();
    }

    async findByUsername(username: string): Promise<SportPermissions> {
        return this.permissions.findOne({ where: { username } });
    }

    async update(username: string, body: SportPermissionsEditDto): Promise<SportPermissions> {
        const verify = await this.findByUsername(username);

        if (!verify) {
            throw new HttpException('Permissões não encontradas', HttpStatus.BAD_REQUEST);
        }

        verify.evento = body.evento;
        verify.competicoes = body.competicoes;
        verify.animal = body.animal;

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
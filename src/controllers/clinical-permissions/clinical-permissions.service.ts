/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalPermissionsEditDto } from './clinical-permissions.dto';
import { ClinicalPermissions } from './clinical-permissions.entity';
@Injectable()
export class ClinicalPermissionsService {
    constructor(
        @InjectRepository(ClinicalPermissions) private readonly permissions: Repository<ClinicalPermissions>
    ) { }

    async create(body: ClinicalPermissions): Promise<ClinicalPermissions> {
        const verify = await this.findByUsername(body.username);

        if (verify) {
            throw new HttpException('Permissões já cadastradas', HttpStatus.BAD_REQUEST);
        }

        return await this.permissions.save(body);
    }

    async findOne(id: string): Promise<ClinicalPermissions> {
        const verify = await this.permissions.findOne({ where: { id } });
        return verify;
    }

    async findAll(): Promise<ClinicalPermissions[]> {
        return this.permissions.find();
    }

    async findByUsername(username: string): Promise<ClinicalPermissions> {
        return this.permissions.findOne({ where: { username } });
    }

    async update(username: string, body: ClinicalPermissionsEditDto): Promise<ClinicalPermissions> {
        const verify = await this.findByUsername(username);

        if (!verify) {
            throw new HttpException('Permissões não encontradas', HttpStatus.BAD_REQUEST);
        }

        verify.nutricional = body.nutricional;
        verify.vermifugacao = body.vermifugacao;
        verify.vacinas = body.vacinas;
        verify.procedimentos = body.procedimentos;
        verify.ferregeamento = body.ferregeamento;
        verify.exames = body.exames;

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
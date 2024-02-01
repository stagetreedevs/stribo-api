/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackingPermissionsEditDto } from './tracking-permissions.dto';
import { TrackingPermissions } from './tracking-permissions.entity';
@Injectable()
export class TrackingPermissionsService {
    constructor(
        @InjectRepository(TrackingPermissions) private readonly permissions: Repository<TrackingPermissions>
    ) { }

    async create(body: TrackingPermissions): Promise<TrackingPermissions> {
        const verify = await this.findByUsername(body.username);

        if (verify) {
            throw new HttpException('Permissões já cadastradas', HttpStatus.BAD_REQUEST);
        }

        return await this.permissions.save(body);
    }

    async findOne(id: string): Promise<TrackingPermissions> {
        const verify = await this.permissions.findOne({ where: { id } });
        return verify;
    }

    async findAll(): Promise<TrackingPermissions[]> {
        return this.permissions.find();
    }

    async findByUsername(username: string): Promise<TrackingPermissions> {
        return this.permissions.findOne({ where: { username } });
    }

    async update(username: string, body: TrackingPermissionsEditDto): Promise<TrackingPermissions> {
        const verify = await this.findByUsername(username);

        if (!verify) {
            throw new HttpException('Permissões não encontradas', HttpStatus.BAD_REQUEST);
        }

        verify.marcacoes = body.marcacoes;
        verify.medidas = body.medidas;

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
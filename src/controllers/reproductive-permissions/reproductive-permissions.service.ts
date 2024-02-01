/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReproductivePermissions } from './reproductive-permissions.entity';
import { ReproductivePermissionsEditDto } from './reproductive-permissions.dto';
@Injectable()
export class ReproductivePermissionsService {
    constructor(
        @InjectRepository(ReproductivePermissions) private readonly permissions: Repository<ReproductivePermissions>
    ) { }

    async create(body: ReproductivePermissions): Promise<ReproductivePermissions> {
        const verify = await this.findByUsername(body.username);

        if (verify) {
            throw new HttpException('Permissões já cadastradas', HttpStatus.BAD_REQUEST);
        }

        return await this.permissions.save(body);
    }

    async findOne(id: string): Promise<ReproductivePermissions> {
        const verify = await this.permissions.findOne({ where: { id } });
        return verify;
    }

    async findAll(): Promise<ReproductivePermissions[]> {
        return this.permissions.find();
    }

    async findByUsername(username: string): Promise<ReproductivePermissions> {
        return this.permissions.findOne({ where: { username } });
    }

    async update(username: string, body: ReproductivePermissionsEditDto): Promise<ReproductivePermissionsEditDto> {
        const verify = await this.findByUsername(username);

        if (!verify) {
            throw new HttpException('Permissões não encontradas', HttpStatus.BAD_REQUEST);
        }
        
        verify.genealogia = body.genealogia;
        verify.inseminação = body.inseminação;
        verify.prenhes = body.prenhes;

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
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { S3Service } from '../s3/s3.service';
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepos: Repository<Admin>,
        private readonly s3Service: S3Service
    ) { }

    async create(admin: Admin, photo: Express.Multer.File): Promise<Admin> {
        let imageUrl: string | null = null;

        if (!!photo) {
            const url = await this.s3Service.upload(photo, 'usuarios');
            imageUrl = url;
        }

        admin.photo = imageUrl;

        return await this.adminRepos.save(admin);
    }

    async findAll(): Promise<Admin[]> {
        return this.adminRepos.find();
    }

    async findOne(id: string): Promise<Admin> {
        return this.adminRepos.findOne({
            where: {
                id: id,
            }
        });
    }

    async findEmail(email: string): Promise<Admin> {
        return this.adminRepos.findOne({
            where: {
                username: email,
            }
        });
    }

    async update(id: string, admin: any, photo: Express.Multer.File): Promise<Admin> {
        const verify = await this.findOne(id);

        if (!verify) {
            throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
        }

        let imageUrl: string | null = verify.photo;

        if (!!photo) {
            const url = await this.s3Service.upload(photo, 'usuarios');
            imageUrl = url;

            if (verify.photo) {
                await this.s3Service.deleteFileS3(verify.photo);
            }
        }

        // Atualiza os campos do usuário apenas se eles não forem nulos
        verify.photo = imageUrl;
        verify.name = admin.name || verify.name;
        verify.username = admin.username || verify.username;
        verify.cpf = admin.cpf || verify.cpf;
        verify.phone = admin.phone || verify.phone;
        verify.role = admin.role || verify.role;

        await this.adminRepos.update(id, verify);
        return this.findOne(id);
    }

    async updatePassword(id: string, newPassword: string): Promise<Admin> {
        const verify = await this.findOne(id);

        if (!verify) {
            throw new HttpException('Administrador nao encontrado', HttpStatus.BAD_REQUEST);
        }

        await this.adminRepos
            .createQueryBuilder()
            .update(Admin)
            .set({ password: newPassword })
            .where("id = :id", { id })
            .execute();

        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const verify = await this.findOne(id);

        await this.s3Service.deleteFileS3(verify.photo);

        if (!verify) {
            throw new HttpException('Administrador nao encontrado', HttpStatus.BAD_REQUEST);
        }

        await this.adminRepos.delete(id);
    }

    // async update(id: string, admin: Admin): Promise<Admin> {
    //     await this.adminRepos.update(id, admin);
    //     return this.adminRepos.findOne({
    //         where: {
    //             id: id,
    //         }
    //     });
    // }

    // async remove(id: string): Promise<void> {
    //     await this.adminRepos.delete(id);
    // }

}
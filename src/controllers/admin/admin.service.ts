/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { S3Service } from '../s3/s3.service';
import { PropertyService } from '../property/property.service';
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin) private readonly adminRepos: Repository<Admin>,
        @Inject(forwardRef(() => PropertyService)) private readonly propertyService: PropertyService,
        private readonly s3Service: S3Service
    ) { }

    async create(body: Admin, photo: Express.Multer.File, property: string): Promise<Admin> {
        const propriedade = await this.propertyService.findOne(property);
        if (!propriedade) {
            throw new HttpException('Propriedade nao encontrada', HttpStatus.BAD_REQUEST);
        }

        let imageUrl: string | null = null;

        if (!!photo) {
            const url = await this.s3Service.upload(photo, 'admin');
            imageUrl = url;
        }

        body.photo = imageUrl;

        const created = await this.adminRepos.save(body);
        await this.propertyService.addAdmins(property, created.id);

        return created;
    }

    async findAll(): Promise<Admin[]> {
        return this.adminRepos.find();
    }

    async findOne(id: string): Promise<Admin> {
        const verify = await this.adminRepos.findOne({ where: { id } });
        if (!verify) {
            throw new HttpException('Administrador não encontrado', HttpStatus.BAD_REQUEST);
        }
        return verify;
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

        let imageUrl: string | null = verify.photo;

        if (!!photo) {
            const url = await this.s3Service.upload(photo, 'admin');
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
        await this.findOne(id);

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

        // Remove a imagem da AWS
        if (verify.photo) {
            await this.s3Service.deleteFileS3(verify.photo);
        }

        // Busca as propriedades associadas ao administrador
        const associatedProperties = await this.propertyService.findByAdmin(id);

        // Remove o administrador de todas as propriedades associadas
        await Promise.all(
            associatedProperties.map(async property => {
                await this.propertyService.removeAdmin(property.id, id);
            })
        );

        // Remove o administrador do banco de dados
        await this.adminRepos.delete(id);
    }


}
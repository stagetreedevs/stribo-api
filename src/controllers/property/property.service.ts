/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './property.entity';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
@Injectable()
export class PropertyService {
    constructor(
        @InjectRepository(Property) private readonly propertyRep: Repository<Property>,
        @Inject(forwardRef(() => AdminService)) private readonly adminService: AdminService,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    ) { }

    async create(body: Property): Promise<Property> {
        const verify = await this.userService.findOne(body.owner);
        if (!verify) {
            throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
        }
        return await this.propertyRep.save(body);
    }

    async findAll(): Promise<Property[]> {
        return this.propertyRep.find();
    }

    async findAllUserProperties(id: string): Promise<Property[]> {
        return this.propertyRep.find({ where: { owner: id } });
    }

    async findByAdmin(adminId: string): Promise<Property[]> {
        const properties = await this.propertyRep.find();
        const filteredProperties = properties.filter(property => property.admins.includes(adminId));
        return filteredProperties;
    }

    async findOne(id: string): Promise<Property> {
        const verify = await this.propertyRep.findOne({ where: { id } });
        if (!verify) {
            throw new HttpException('Propriedade não encontrada', HttpStatus.BAD_REQUEST);
        }
        return verify;
    }

    async findAdminsForProperty(propertyId: string): Promise<any[]> {
        const property: Property = await this.findOne(propertyId);

        const adminIds: string[] = property.admins;
        const adminResults: any[] = [];

        for (const adminId of adminIds) {
            const adminResult = await this.adminService.findOne(adminId);
            adminResults.push(adminResult);
        }

        return adminResults;
    }

    async updateInputs(id: string, body: any): Promise<Property> {
        const verify = await this.findOne(id);

        if (!verify) {
            throw new HttpException('Propriedade nao encontrada', HttpStatus.BAD_REQUEST);
        }

        verify.name = body.name || verify.name;
        verify.code = body.code || verify.code;

        await this.propertyRep.update(id, verify);
        return this.findOne(id);
    }

    async addAdmins(id: string, adminId: string): Promise<Property> {
        const property = await this.findOne(id);

        if (!adminId) {
            throw new HttpException('ID do administrador não fornecido', HttpStatus.BAD_REQUEST);
        }

        const isAlreadyInserted = property.admins.includes(adminId);

        if (isAlreadyInserted) {
            throw new HttpException('Administrador já cadastrado na propriedade', HttpStatus.BAD_REQUEST);
        }

        property.admins.push(adminId);

        await this.propertyRep.update(id, { admins: property.admins });

        return await this.findOne(id);
    }

    async removeAdmin(id: string, adminId: string): Promise<Property> {
        const property = await this.findOne(id);

        if (!adminId) {
            throw new HttpException('ID do administrador não fornecido', HttpStatus.BAD_REQUEST);
        }

        const index = property.admins.indexOf(adminId);

        if (index === -1) {
            throw new HttpException('Administrador não associado à propriedade', HttpStatus.BAD_REQUEST);
        }

        property.admins.splice(index, 1);

        await this.propertyRep.update(id, { admins: property.admins });

        return await this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.propertyRep.delete(id);
    }

}
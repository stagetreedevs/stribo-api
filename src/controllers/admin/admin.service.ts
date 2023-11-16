/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepos: Repository<Admin>,
    ) { }

    async create(admin: Admin): Promise<Admin> {
        return this.adminRepos.save(admin);
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
                email: email,
            }
        });
    }

    async update(id: string, admin: Admin): Promise<Admin> {
        await this.adminRepos.update(id, admin);
        return this.adminRepos.findOne({
            where: {
                id: id,
            }
        });
    }

    async remove(id: string): Promise<void> {
        await this.adminRepos.delete(id);
    }

}
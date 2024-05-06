/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nutritional } from './nutritional.entity';
@Injectable()
export class NutritionalService {
    constructor(
        @InjectRepository(Nutritional) private readonly nutriRepos: Repository<Nutritional>
    ) { }

    async create(body: Nutritional): Promise<Nutritional> {
        return await this.nutriRepos.save(body);
    }

    async findOne(id: string): Promise<Nutritional> {
        return await this.nutriRepos.findOne({ where: { id } });
    }

    async findAll(): Promise<Nutritional[]> {
        return this.nutriRepos.find();
    }

    async findByAnimal(animal_id: string): Promise<Nutritional[]> {
        return this.nutriRepos.find({ where: { animal_id } });
    }

    async update(id: string, body: any): Promise<Nutritional> {
        const verify = await this.findOne(id);

        if (!verify) {
            throw new HttpException('Prduto nao encontrado', HttpStatus.BAD_REQUEST);
        }

        verify.product = body.product;
        verify.quantity = body.quantity;

        await this.nutriRepos.update(id, verify);
        return this.findOne(id);
    }

    async removeProduct(id: string): Promise<void> {
        const verify = await this.findOne(id);
        if (!verify) {
            throw new HttpException('Prduto nao encontrado', HttpStatus.BAD_REQUEST);
        }
        await this.nutriRepos.delete(id);

    }
    async removeManagement(animal_id: string): Promise<void> {
        try {
            const produtos = await this.findByAnimal(animal_id);

            for (const product of produtos) {
                await this.removeProduct(product.id);
            }
        } catch (error) {
            throw new HttpException('Falha ao excluir manejo', HttpStatus.BAD_REQUEST);
        }
    }

}
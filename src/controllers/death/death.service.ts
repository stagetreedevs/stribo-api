/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Death } from './death.entity';
import { AnimalService } from '../animal/animal.service';
@Injectable()
export class DeathService {
    constructor(
        @InjectRepository(Death) private readonly morgue: Repository<Death>,
        @Inject(forwardRef(() => AnimalService)) private readonly animalService: AnimalService,
    ) { }

    async create(body: Death): Promise<Death> {
        const animal = await this.findByAnimal(body.animal_id);

        if (animal) {
            throw new HttpException('O animal já está morto', HttpStatus.BAD_REQUEST);
        }

        // Atualizar o status de vida
        await this.animalService.lifeStats(body.animal_id);

        return await this.morgue.save(body);
    }

    async findOne(id: string): Promise<Death> {
        const verify = await this.morgue.findOne({ where: { id } });
        return verify;
    }

    async findByAnimal(animal_id: string): Promise<Death> {
        return this.morgue.findOne({ where: { animal_id } });
    }

    async findAll(): Promise<Death[]> {
        return this.morgue.find();
    }

    async update(animal_id: string, body: any): Promise<Death> {
        const verify = await this.findByAnimal(animal_id);

        if (!verify) {
            throw new HttpException('Animal nao encontrado', HttpStatus.BAD_REQUEST);
        }

        verify.dateDeath = body.dateDeath;
        verify.reason = body.reason;

        await this.morgue.update(verify.id, verify);
        return this.findOne(verify.id);
    }

    async revive(animal_id: string): Promise<void> {
        const animal = await this.findByAnimal(animal_id);

        if (!animal) {
            throw new HttpException('Animal nao encontrado', HttpStatus.BAD_REQUEST);
        }

        // Atualizar o status de vida
        await this.animalService.lifeStats(animal_id);

        await this.morgue.delete(animal.id);
    }

    async delete(animal_id: string): Promise<void> {
        const animal = await this.findByAnimal(animal_id);
        await this.morgue.delete(animal.id);
    }

}
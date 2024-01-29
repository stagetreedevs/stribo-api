/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Biometry } from './biometry.entity';
import { AnimalService } from '../animal/animal.service';
@Injectable()
export class BiometryService {
    constructor(
        @InjectRepository(Biometry) private readonly bioRepos: Repository<Biometry>,
        @Inject(forwardRef(() => AnimalService)) private readonly animalService: AnimalService,
    ) { }

    async create(body: Biometry): Promise<Biometry> {
        const animal = await this.animalService.findOne(body.animal_id);

        if (!animal) {
            throw new HttpException('Animal não encontrado', HttpStatus.BAD_REQUEST);
        }

        if (animal.alive === false) {
            throw new HttpException('O animal está morto', HttpStatus.BAD_REQUEST);
        }

        return await this.bioRepos.save(body);
    }

    async findAll(): Promise<Biometry[]> {
        return this.bioRepos.find();
    }

    async findByAnimal(animal_id: string): Promise<Biometry[]> {
        return this.bioRepos.find({
            where: { animal_id },
            order: { date: 'DESC' }
        });
    }

    async findWithDiffs(animal_id: string): Promise<any> {
        try {
            const data: any = await this.findByAnimal(animal_id);

            if (!data) {
                throw new Error("Animal sem medidas cadastradas");
            }
            
            const firstEntry = data[0];

            const result = data.map(entry => {
                const weightDiff = entry.weight - firstEntry.weight;
                const heightDiff = entry.height - firstEntry.height;

                return {
                    ...entry,
                    weight_dif: weightDiff,
                    height_dif: heightDiff,
                };
            });

            return result;

        } catch (error) {
            throw new Error("Falha ao listar medidas");
        }
    }

    async delete(animal_id: string): Promise<void> {
        try {
            const medidas = await this.findByAnimal(animal_id);

            for (const info of medidas) {
                await this.bioRepos.delete(info.id);
            }
        } catch (error) {
            throw new Error("Falha ao excluir medidas");
        }
    }

}
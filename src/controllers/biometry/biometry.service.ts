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
        const biometries = await this.bioRepos.find({
            where: { animal_id },
            order: { date: 'DESC' }
        });

        const biometriesWithNumbers = biometries.map(biometry => ({
            ...biometry,
            weight: parseFloat(biometry.weight.toString()),
            height: parseFloat(biometry.height.toString())
        }));

        return biometriesWithNumbers;
    }

    async findHeights(animal_id: string): Promise<any> {
        const biometries = await this.findByAnimal(animal_id);
        const limitedBiometries = biometries.slice(0, 7);
        const labels = limitedBiometries.map(biometry => {
            const date = new Date(biometry.date);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        });
        const datasets = [{
            data: limitedBiometries.map(biometry => parseFloat(biometry.height.toString())),
        }];

        labels.reverse();
        for (const dataset of datasets) {
            dataset.data.reverse();
        }

        return { labels, datasets };
    }

    async findWeights(animal_id: string): Promise<any> {
        const biometries = await this.findByAnimal(animal_id);
        const limitedBiometries = biometries.slice(0, 7);
        const labels = limitedBiometries.map(biometry => {
            const date = new Date(biometry.date);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        });
        const datasets = [{
            data: limitedBiometries.map(biometry => parseFloat(biometry.weight.toString())),
        }];

        labels.reverse();
        for (const dataset of datasets) {
            dataset.data.reverse();
        }

        return { labels, datasets };
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
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { Animal } from './animal.entity';
@Injectable()
export class AnimalService {
    constructor(
        @InjectRepository(Animal) private readonly animal: Repository<Animal>,
        private readonly s3Service: S3Service
    ) { }

    async create(body: Animal, photo: Express.Multer.File): Promise<Animal> {
        let imageUrl: string | null = null;

        if (!!photo) {
            const url = await this.s3Service.upload(photo, 'animal');
            imageUrl = url;
        }

        body.photo = imageUrl;

        return await this.animal.save(body);
    }

    async findAll(): Promise<Animal[]> {
        return this.animal.find();
    }

    async findOne(id: string): Promise<Animal> {
        return this.animal.findOne({ where: { id } });
    }

    async findByOwner(id: string): Promise<Animal> {
        return this.animal.findOne({ where: { owner: id } });
    }

    async update(id: string, body: any, photo: Express.Multer.File): Promise<Animal> {
        const verify = await this.findOne(id);

        if (!verify) {
            throw new HttpException('Animal nao encontrado', HttpStatus.BAD_REQUEST);
        }

        let imageUrl: string | null = verify.photo;

        if (!!photo) {
            const url = await this.s3Service.upload(photo, 'animal');
            imageUrl = url;

            if (verify.photo) {
                await this.s3Service.deleteFileS3(verify.photo);
            }
        }

        // Atualiza os campos do usuário apenas se eles não forem nulos
        verify.photo = imageUrl;
        verify.name = body.name || verify.name;
        verify.race = body.race || verify.race;
        verify.coat = body.coat || verify.coat;
        verify.registerNumber = body.registerNumber || verify.registerNumber;
        verify.property = body.property || verify.property;
        verify.sex = body.sex || verify.sex;
        verify.occupation = body.occupation || verify.occupation;
        verify.register = body.register || verify.register;
        verify.sale = body.sale || verify.sale;
        verify.value = body.value || verify.value;
        verify.birthDate = body.birthDate || verify.birthDate;
        verify.castrationDate = body.castrationDate || verify.castrationDate;
        verify.father = body.father || verify.father;
        verify.mother = body.mother || verify.mother;

        await this.animal.update(id, verify);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const verify = await this.findOne(id);
        if (!verify) {
            throw new HttpException('Animal nao encontrado', HttpStatus.BAD_REQUEST);
        }

        // Remove a imagem da AWS
        if (verify.photo) {
            await this.s3Service.deleteFileS3(verify.photo);
        }

        await this.animal.delete(id);
    }


}
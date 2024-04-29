/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimalDocument } from './animal-document.entity';
import { S3Service } from 'src/controllers/s3/s3.service';
import { AnimalService } from '../animal.service';
@Injectable()
export class AnimalDocumentService {
    constructor(
        @InjectRepository(AnimalDocument) private readonly document: Repository<AnimalDocument>,
        @Inject(forwardRef(() => AnimalService)) private readonly animalService: AnimalService,
        private readonly s3Service: S3Service
    ) { }

    async create(body: any, file: Express.Multer.File): Promise<any> {
        if (!file) {
            throw new HttpException('Arquivo não enviado', HttpStatus.BAD_REQUEST);
        }
        
        if(!body.animal) {
            throw new HttpException('Animal não escolhido', HttpStatus.BAD_REQUEST);
        }

        const animal = await this.animalService.findOne(body.animal);

        body.property = animal.property;
        body.filename = file.originalname;
        body.size = this.bytesToKB(file.size);

        const url = await this.s3Service.upload(file, 'documents');
        body.url = url;

        return await this.document.save(body);
    }

    bytesToKB(bytes: number): string {
        if (bytes < 1200 * 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else if (bytes < 999 * 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        } else {
            return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        }
    }

    async findAll(): Promise<any[]> {
        return this.document.find();
    }

    async findOne(id: string): Promise<any> {
        const verify = await this.document.findOne({ where: { id } });
        if (!verify) {
            throw new HttpException('Documento não encontrado', HttpStatus.BAD_REQUEST);
        }
        return verify;
    }

    async findAnimalDocuments(animal: string): Promise<any[]> {
        return await this.document.find({ where: { animal } });
    }

    async removeAllDocuments(id: string): Promise<void> {
        const documents = await this.findAnimalDocuments(id);

        if(documents.length > 0) {
            for(const documento of documents) {
                await this.remove(documento.id);
            }
        }
    }

    async remove(id: string): Promise<void> {
        const verify = await this.findOne(id);
        // Remove o documento da AWS
        await this.s3Service.deleteFileS3(verify.url);
        await this.document.delete(id);
    }

}
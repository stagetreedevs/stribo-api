/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalDocument } from './animal-document.entity';
import { AnimalDocumentService } from './animal-document.service';
import { AnimalDocumentController } from './animal-document.controller';
import { S3Module } from 'src/controllers/s3/s3.module';
import { AnimalModule } from '../animal.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([AnimalDocument]),
        forwardRef(() => AnimalModule),
        S3Module,
    ],
    controllers: [AnimalDocumentController],
    providers: [AnimalDocumentService],
    exports: [AnimalDocumentService]
})
export class AnimalDocumentModule { }

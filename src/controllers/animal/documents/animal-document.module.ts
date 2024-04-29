/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalDocument } from './animal-document.entity';
import { AnimalDocumentService } from './animal-document.service';
import { AnimalDocumentController } from './animal-document.controller';
import { S3Module } from 'src/controllers/s3/s3.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([AnimalDocument]),
        S3Module,
    ],
    controllers: [AnimalDocumentController],
    providers: [AnimalDocumentService],
    exports: [AnimalDocumentService]
})
export class AnimalDocumentModule { }

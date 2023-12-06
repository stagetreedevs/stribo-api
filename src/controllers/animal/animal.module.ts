/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './animal.entity';
import { S3Module } from '../s3/s3.module';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([Animal]),
        S3Module,
    ],
    controllers: [AnimalController],
    providers: [AnimalService],
    exports: [AnimalService]
})
export class AnimalModule { }

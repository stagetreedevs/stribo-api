/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './animal.entity';
import { S3Module } from '../s3/s3.module';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { UserModule } from '../user/user.module';
import { DeathModule } from '../death/death.module';
import { NutritionalModule } from '../nutritional/nutritional.module';
import { BiometryModule } from '../biometry/biometry.module';
import { AnimalDocumentModule } from './documents/animal-document.module';
import { Breed } from './breed.entity';
import { Coat } from './coat.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Animal, Breed, Coat]),
    forwardRef(() => DeathModule),
    forwardRef(() => BiometryModule),
    forwardRef(() => AnimalDocumentModule),
    S3Module,
    UserModule,
    NutritionalModule,
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
  exports: [AnimalService],
})
export class AnimalModule {}

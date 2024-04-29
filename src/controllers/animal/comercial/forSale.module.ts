/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 'src/controllers/s3/s3.module';
import { ForSale } from './forSale.entity';
import { ForSaleController } from './forSale.controller';
import { ForSaleService } from './forSale.service';
import { AnimalModule } from '../animal.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([ForSale]),
        forwardRef(() => AnimalModule),
        S3Module,
    ],
    controllers: [ForSaleController],
    providers: [ForSaleService],
    exports: [ForSaleService]
})
export class ForSaleModule { }

/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { S3Module } from '../s3/s3.module';
import { PropertyModule } from '../property/property.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        S3Module,
        forwardRef(() => PropertyModule)
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule { }

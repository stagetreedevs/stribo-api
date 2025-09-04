/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { AnimalModule } from 'src/controllers/animal/animal.module';
import { S3Module } from 'src/controllers/s3/s3.module';
import { OneSignalModule } from 'src/services/one-signal/one-signal.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    forwardRef(() => AnimalModule),
    S3Module,
    OneSignalModule,
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}

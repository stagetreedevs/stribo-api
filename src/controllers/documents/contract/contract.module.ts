/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { AnimalModule } from 'src/controllers/animal/animal.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Contract]),
        forwardRef(() => AnimalModule)
    ],
    controllers: [ContractController],
    providers: [ContractService],
    exports: [ContractService]
})
export class ContractModule { }
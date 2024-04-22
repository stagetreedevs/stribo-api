/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankSlip } from './bank-slip.entity';
import { BankSlipController } from './bank-slip.controller';
import { BankSlipService } from './bank-slip.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([BankSlip])
    ],
    controllers: [BankSlipController],
    providers: [BankSlipService],
    exports: [BankSlipService]
})
export class BankSlipModule { }
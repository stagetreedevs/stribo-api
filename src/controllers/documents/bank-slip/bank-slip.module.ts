/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankSlip } from './bank-slip.entity';
import { BankSlipController } from './bank-slip.controller';
import { BankSlipService } from './bank-slip.service';
import { AsaasModule } from 'src/services/asaas/asaas.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankSlip]), AsaasModule],
  controllers: [BankSlipController],
  providers: [BankSlipService],
  exports: [BankSlipService],
})
export class BankSlipModule {}

import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './entity/bank-account.entity';
import { FinancialController } from './financial.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount])],
  providers: [FinancialService],
  controllers: [FinancialController],
})
export class FinancialModule {}

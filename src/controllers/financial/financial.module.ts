import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './entity/bank-account.entity';
import { FinancialController } from './financial.controller';
import { Category } from './entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount, Category])],
  providers: [FinancialService],
  controllers: [FinancialController],
})
export class FinancialModule {}

import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './entity/bank-account.entity';
import { FinancialController } from './financial.controller';
import { Category } from './entity/category.entity';
import { AnimalModule } from '../animal/animal.module';
import { Transaction } from './entity/transaction.entity';
import { Installment } from './entity/installment.entity';
import { S3Module } from '../s3/s3.module';
import { CompetitionModule } from '../competition/competition.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BankAccount, Category, Transaction, Installment]),
    CompetitionModule,
    AnimalModule,
    S3Module,
  ],
  providers: [FinancialService],
  controllers: [FinancialController],
})
export class FinancialModule {}

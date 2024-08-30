import { Module } from '@nestjs/common';
import { SemenReceiptController } from './semen-receipt.controller';
import { SemenReceiptService } from './semen-receipt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemenReceipt } from './semen-receipt.entity';
import { AnimalModule } from '../animal/animal.module';

@Module({
  imports: [TypeOrmModule.forFeature([SemenReceipt]), AnimalModule],
  controllers: [SemenReceiptController],
  providers: [SemenReceiptService],
})
export class SemenReceiptModule {}

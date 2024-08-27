import { Module } from '@nestjs/common';
import { SemenService } from './semen.service';
import { SemenController } from './semen.controller';
import { AnimalModule } from '../animal/animal.module';
import { SemenShipping } from './entity/shipping.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemenReceipt } from './entity/receipt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SemenShipping, SemenReceipt]),
    AnimalModule,
  ],
  providers: [SemenService],
  controllers: [SemenController],
})
export class SemenModule {}

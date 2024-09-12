import { Module } from '@nestjs/common';
import { SemenShippingService } from './semen-shipping.service';
import { SemenShippingController } from './semen-shipping.controller';
import { AnimalModule } from '../animal/animal.module';
import { SemenShipping } from './semen-shipping.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SemenShipping]), AnimalModule],
  providers: [SemenShippingService],
  controllers: [SemenShippingController],
  exports: [SemenShippingService],
})
export class SemenShippingModule {}

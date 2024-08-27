import { Module } from '@nestjs/common';
import { SemenService } from './semen.service';
import { SemenController } from './semen.controller';
import { AnimalModule } from '../animal/animal.module';
import { SemenShipping } from './entity/shipping.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SemenShipping]), AnimalModule],
  providers: [SemenService],
  controllers: [SemenController],
})
export class SemenModule {}

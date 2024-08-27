import { Module } from '@nestjs/common';
import { SemenService } from './semen.service';
import { SemenController } from './semen.controller';
import { AnimalModule } from '../animal/animal.module';

@Module({
  imports: [AnimalModule],
  providers: [SemenService],
  controllers: [SemenController],
})
export class SemenModule {}

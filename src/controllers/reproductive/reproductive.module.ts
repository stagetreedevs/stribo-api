import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReproductiveService } from './reproductive.service';
import { ReproductiveController } from './reproductive.controller';
import { AnimalModule } from '../animal/animal.module';
import { Reproductive } from './reproductive.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reproductive]), AnimalModule],
  providers: [ReproductiveService],
  controllers: [ReproductiveController],
})
export class ReproductiveModule {}

import { Module } from '@nestjs/common';
import { SemenFrozenController } from './semen-frozen.controller';
import { SemenFrozenService } from './semen-frozen.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemenFrozen } from './semen-frozen.entity';
import { AnimalModule } from '../animal/animal.module';

@Module({
  imports: [TypeOrmModule.forFeature([SemenFrozen]), AnimalModule],
  controllers: [SemenFrozenController],
  providers: [SemenFrozenService],
})
export class SemenFrozenModule {}

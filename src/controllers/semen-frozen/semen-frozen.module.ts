import { Module } from '@nestjs/common';
import { SemenFrozenController } from './semen-frozen.controller';
import { SemenFrozenService } from './semen-frozen.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemenFrozen } from './semen-frozen.entity';
import { AnimalModule } from '../animal/animal.module';
import { CylinderModule } from '../cylinder/cylinder.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SemenFrozen]),
    AnimalModule,
    CylinderModule,
  ],
  controllers: [SemenFrozenController],
  providers: [SemenFrozenService],
  exports: [SemenFrozenService],
})
export class SemenFrozenModule {}

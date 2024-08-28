import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CylinderController } from './cylinder.controller';
import { CylinderService } from './cylinder.service';
import { Cylinder } from './cylinder.entity';
import { AnimalModule } from '../animal/animal.module';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cylinder]), AnimalModule, PropertyModule],
  controllers: [CylinderController],
  providers: [CylinderService],
})
export class CylinderModule {}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Procedure } from './procedure.entity';
import { ProcedureController } from './procedure.controller';
import { ProcedureService } from './procedure.service';
import { AnimalModule } from '../animal/animal.module';
@Module({
  imports: [TypeOrmModule.forFeature([Procedure]), AnimalModule],
  controllers: [ProcedureController],
  providers: [ProcedureService],
  exports: [ProcedureService],
})
export class ProcedureModule {}

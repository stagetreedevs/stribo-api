/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Procedure } from './procedure.entity';
import { ProcedureController } from './procedure.controller';
import { ProcedureService } from './procedure.service';
import { AnimalModule } from '../animal/animal.module';
import { OneSignalModule } from 'src/services/one-signal/one-signal.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Procedure]),
    AnimalModule,
    OneSignalModule,
  ],
  controllers: [ProcedureController],
  providers: [ProcedureService],
  exports: [ProcedureService],
})
export class ProcedureModule {}

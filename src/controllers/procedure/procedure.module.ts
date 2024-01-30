/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Procedure } from './procedure.entity';
import { ProcedureController } from './procedure.controller';
import { ProcedureService } from './procedure.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([Procedure]),
    ],
    controllers: [ProcedureController],
    providers: [ProcedureService],
    exports: [ProcedureService]
})
export class ProcedureModule { }

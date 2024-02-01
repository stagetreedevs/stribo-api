/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialPermissionsController } from './financial-permissions.controller';
import { FinancialPermissions } from './financial-permissions.entity';
import { FinancialPermissionsService } from './financial-permissions.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([FinancialPermissions])
    ],
    controllers: [FinancialPermissionsController],
    providers: [FinancialPermissionsService],
    exports: [FinancialPermissionsService]
})
export class FinancialPermissionsModule { }
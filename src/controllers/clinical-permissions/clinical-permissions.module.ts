/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalPermissionsController } from './clinical-permissions.controller';
import { ClinicalPermissions } from './clinical-permissions.entity';
import { ClinicalPermissionsService } from './clinical-permissions.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([ClinicalPermissions]),
    ],
    controllers: [ClinicalPermissionsController],
    providers: [ClinicalPermissionsService],
    exports: [ClinicalPermissionsService]
})
export class ClinicalPermissionsModule { }
/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationPermissions } from './registration-permissions.entity';
import { RegistrationPermissionsController } from './registration-permissions.controller';
import { RegistrationPermissionsService } from './registration-permissions.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([RegistrationPermissions]),
    ],
    controllers: [RegistrationPermissionsController],
    providers: [RegistrationPermissionsService],
    exports: [RegistrationPermissionsService]
})
export class RegistrationPermissionsModule { }
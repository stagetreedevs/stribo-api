/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommercialPermissionsController } from './commercial-permissions.controller';
import { CommercialPermissions } from './commercial-permissions.entity';
import { CommercialPermissionsService } from './commercial-permissions.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([CommercialPermissions])
    ],
    controllers: [CommercialPermissionsController],
    providers: [CommercialPermissionsService],
    exports: [CommercialPermissionsService]
})
export class CommercialPermissionsModule { }
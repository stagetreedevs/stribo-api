/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingPermissionsController } from './tracking-permissions.controller';
import { TrackingPermissions } from './tracking-permissions.entity';
import { TrackingPermissionsService } from './tracking-permissions.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([TrackingPermissions]),
    ],
    controllers: [TrackingPermissionsController],
    providers: [TrackingPermissionsService],
    exports: [TrackingPermissionsService]
})
export class TrackingPermissionsModule { }
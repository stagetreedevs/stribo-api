/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesPermissionsController } from './purchases-permissions.controller';
import { PurchasesPermissions } from './purchases-permissions.entity';
import { PurchasesPermissionsService } from './purchases-permissions.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([PurchasesPermissions])
    ],
    controllers: [PurchasesPermissionsController],
    providers: [PurchasesPermissionsService],
    exports: [PurchasesPermissionsService]
})
export class PurchasesPermissionsModule { }
/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReproductivePermissionsController } from './reproductive-permissions.controller';
import { ReproductivePermissions } from './reproductive-permissions.entity';
import { ReproductivePermissionsService } from './reproductive-permissions.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([ReproductivePermissions]),
    ],
    controllers: [ReproductivePermissionsController],
    providers: [ReproductivePermissionsService],
    exports: [ReproductivePermissionsService]
})
export class ReproductivePermissionsModule { }
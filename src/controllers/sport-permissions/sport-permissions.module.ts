/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportPermissionsController } from './sport-permissions.controller';
import { SportPermissions } from './sport-permissions.entity';
import { SportPermissionsService } from './sport-permissions.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([SportPermissions])
    ],
    controllers: [SportPermissionsController],
    providers: [SportPermissionsService],
    exports: [SportPermissionsService]
})
export class SportPermissionsModule { }
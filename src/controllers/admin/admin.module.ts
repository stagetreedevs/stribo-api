/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { S3Module } from '../s3/s3.module';
import { PropertyModule } from '../property/property.module';
import { UserModule } from '../user/user.module';
import { jwtConstants } from 'src/auth/constants';
import { ClinicalPermissionsModule } from '../clinical-permissions/clinical-permissions.module';
import { CommercialPermissionsModule } from '../commercial-permissions/commercial-permissions.module';
import { FinancialPermissionsModule } from '../financial-permissions/financial-permissions.module';
import { PurchasesPermissionsModule } from '../purchases-permissions/purchases-permissions.module';
import { RegistrationPermissionsModule } from '../registration-permissions/registration-permissions.module';
import { ReproductivePermissionsModule } from '../reproductive-permissions/reproductive-permissions.module';
import { SportPermissionsModule } from '../sport-permissions/sport-permissions.module';
import { TrackingPermissionsModule } from '../tracking-permissions/tracking-permissions.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        forwardRef(() => PropertyModule),
        forwardRef(() => UserModule),
        forwardRef(() => ClinicalPermissionsModule),
        forwardRef(() => CommercialPermissionsModule),
        forwardRef(() => FinancialPermissionsModule),
        forwardRef(() => PurchasesPermissionsModule),
        forwardRef(() => RegistrationPermissionsModule),
        forwardRef(() => ReproductivePermissionsModule),
        forwardRef(() => SportPermissionsModule),
        forwardRef(() => TrackingPermissionsModule),
        S3Module,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '360h' },
        }),
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule { }

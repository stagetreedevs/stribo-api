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
@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        forwardRef(() => PropertyModule),
        forwardRef(() => UserModule),
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

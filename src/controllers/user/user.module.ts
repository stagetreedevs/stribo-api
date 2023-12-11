/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { S3Module } from '../s3/s3.module';
import { AdminModule } from '../admin/admin.module';
import { PropertyModule } from '../property/property.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AdminModule),
        forwardRef(() => PropertyModule),
        S3Module,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }

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
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AdminModule),
        forwardRef(() => PropertyModule),
        S3Module,
        JwtModule.register({
            secret: 'mySecretKey',
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }

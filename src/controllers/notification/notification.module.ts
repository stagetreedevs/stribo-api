/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Notification]),
        UserModule
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
})
export class NotificationModule { }

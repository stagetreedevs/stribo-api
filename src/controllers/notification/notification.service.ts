/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { UserService } from '../user/user.service';
@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) private readonly notRepository: Repository<Notification>,
        private readonly userService: UserService
    ) { }

    async create(notification: Notification): Promise<Notification> {
        return await this.notRepository.save(notification);
    }

    async findAll(): Promise<Notification[]> {
        return this.notRepository.find();
    }

    async findAllReads(user: string): Promise<Notification[]> {
        const usuario = await this.userService.findOne(user);

        if (!usuario) {
            throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
        }

        return this.notRepository.find({
            where: {
                user,
                read: true
            }
        });
    }

    async findAllUnreads(user: string): Promise<Notification[]> {
        const usuario = await this.userService.findOne(user);

        if (!usuario) {
            throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
        }

        return this.notRepository.find({
            where: {
                user,
                read: false
            }
        });
    }

    async findUserNotification(user: string): Promise<any[]> {
        const usuario = await this.userService.findOne(user);

        if (!usuario) {
            throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
        }

        const notifications = await this.notRepository.find({ where: { user } });

        const groupedNotifications: { [key: string]: any[] } = notifications.reduce((acc, notification) => {
            const date = notification.date.toString();
            if (!acc[date]) {
                acc[date] = [];
            }

            acc[date].push({
                title: notification.title,
                message: notification.message,
                hour: notification.hour,
                read: notification.read,
            });

            return acc;
        }, {});

        const result = Object.entries(groupedNotifications).map(([date, notifications]) => {
            return {
                date,
                notifications,
            };
        });

        return result;
    }

    async findOne(id: string): Promise<Notification> {
        const verify = await this.notRepository.findOne({ where: { id } });

        if (!verify) {
            throw new HttpException('Notificacao nao encontrada', HttpStatus.BAD_REQUEST);
        }

        return verify;
    }

    async markAllRead(user: string): Promise<void> {
        const usuario = await this.userService.findOne(user);

        if (!usuario) {
            throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
        }

        await this.notRepository.update({ user }, { read: true });
    }

    async markOneRead(id: string): Promise<void> {
        const notification = await this.findOne(id);

        if (!notification) {
            throw new HttpException('Notificacao nao encontrada', HttpStatus.BAD_REQUEST);
        }

        await this.notRepository.update(id, { read: true });
    }

}

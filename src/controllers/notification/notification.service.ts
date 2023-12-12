/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { UserService } from '../user/user.service';
import { FilterNotificationDto } from './notification.dto';
@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) private readonly notification: Repository<Notification>,
        private readonly userService: UserService
    ) { }

    async create(notification: Notification): Promise<Notification> {
        return await this.notification.save(notification);
    }

    async findAll(): Promise<Notification[]> {
        return this.notification.find();
    }

    async findAllReads(user: string): Promise<Notification[]> {
        const usuario = await this.userService.findOne(user);

        if (!usuario) {
            throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
        }

        return this.notification.find({
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

        return this.notification.find({
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

        const notifications = await this.notification.find({ where: { user } });

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
                animal: notification.animal,
                operator: notification.operator,
                category: notification.category,
                subCategory: notification.subCategory
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
        const verify = await this.notification.findOne({ where: { id } });

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

        await this.notification.update({ user }, { read: true });
    }

    async markOneRead(id: string): Promise<void> {
        const notification = await this.findOne(id);

        if (!notification) {
            throw new HttpException('Notificacao nao encontrada', HttpStatus.BAD_REQUEST);
        }

        await this.notification.update(id, { read: true });
    }

    async findAllAnimals(): Promise<string[]> {
        const animals = await this.notification.find();
        const uniqueAnimals = new Set<string>();

        animals.forEach((notification) => {
            uniqueAnimals.add(notification.animal);
        });

        return Array.from(uniqueAnimals);
    }

    async findAllCategories(): Promise<string[]> {
        const categories = await this.notification.find();
        const unique = new Set<string>();

        categories.forEach((notification) => {
            unique.add(notification.category);
        });

        return Array.from(unique);
    }

    async findAllSubCategories(): Promise<string[]> {
        const categories = await this.notification.find();
        const unique = new Set<string>();

        categories.forEach((notification) => {
            unique.add(notification.subCategory);
        });

        return Array.from(unique);
    }

    async findFiltered(filterDto: FilterNotificationDto): Promise<Notification[]> {
        const queryBuilder = this.notification.createQueryBuilder('notification');

        if (filterDto.initialDate) {
            queryBuilder.andWhere('notification.date >= :initialDate', {
                initialDate: filterDto.initialDate,
            });
        }

        if (filterDto.lastDate) {
            queryBuilder.andWhere('notification.date <= :lastDate', {
                lastDate: filterDto.lastDate,
            });
        }

        if (filterDto.animal) {
            queryBuilder.andWhere('notification.animal ILIKE :animal', { animal: `%${filterDto.animal}%` });
        }

        if (filterDto.operator) {
            queryBuilder.andWhere('notification.operator ILIKE :operator', { operator: `%${filterDto.operator}%` });
        }

        if (filterDto.category) {
            queryBuilder.andWhere('notification.category = :category', { category: filterDto.category });
        }

        if (filterDto.subCategory) {
            queryBuilder.andWhere('notification.subCategory = :subCategory', { subCategory: filterDto.subCategory });
        }

        if (filterDto.order && (filterDto.order.toUpperCase() === 'ASC' || filterDto.order.toUpperCase() === 'DESC')) {
            queryBuilder.addOrderBy('notification.date', filterDto.order as 'ASC' | 'DESC');
        }

        return queryBuilder.getMany();
    }


    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.notification.delete(id);
    }

}

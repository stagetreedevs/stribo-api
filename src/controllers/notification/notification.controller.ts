/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { NotificationService } from './notification.service';
import { FilterNotificationDto, NotificationDto } from './notification.dto';
import { Notification } from './notification.entity';
@ApiTags('NOTIFICAÇÕES')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    @ApiOperation({ summary: 'CRIAR NOTIFICAÇÃO' })
    @ApiBody({ type: NotificationDto })
    async create(@Body() content: Notification): Promise<Notification> {
        return this.notificationService.create(content);
    }

    @Post('filter')
    @ApiOperation({ summary: 'FILTRO PARA NOTIFICAÇÕES' })
    @ApiBody({ type: FilterNotificationDto })
    async findFiltered(
        @Body() body: FilterNotificationDto,
    ): Promise<Notification[]> {
        return this.notificationService.findFiltered(body);
    }

    @Get()
    @ApiOperation({ summary: 'TODAS NOTIFICAÇÕES' })
    async findAll(): Promise<Notification[]> {
        return this.notificationService.findAll();
    }

    @Get('animals')
    @ApiOperation({ summary: 'TODAS OS ANIMAIS' })
    async findAllAnimals(): Promise<string[]> {
        return this.notificationService.findAllAnimals();
    }

    @Get('categories')
    @ApiOperation({ summary: 'TODAS AS CATEGORIAS' })
    async findAllCategories(): Promise<string[]> {
        return this.notificationService.findAllCategories();
    }

    @Get('subCategories')
    @ApiOperation({ summary: 'TODAS AS SUBCATEGORIAS' })
    async findAllSubCategories(): Promise<string[]> {
        return this.notificationService.findAllSubCategories();
    }

    @Get(':notificationId')
    @ApiOperation({ summary: 'NOTIFICAÇÃO VIA ID' })
    async findOne(@Param('notificationId') notificationId: string): Promise<Notification> {
        return this.notificationService.findOne(notificationId);
    }

    @Get(':userId/all')
    @ApiOperation({ summary: 'NOTIFICAÇÕES LIDAS POR USUÁRIO' })
    async findUserNotification(@Param('userId') userId: string): Promise<Notification[]> {
        return this.notificationService.findUserNotification(userId);
    }

    @Get(':userId/reads')
    @ApiOperation({ summary: 'NOTIFICAÇÕES LIDAS POR USUÁRIO' })
    async findAllReads(@Param('userId') userId: string): Promise<Notification[]> {
        return this.notificationService.findAllReads(userId);
    }

    @Get(':userId/unreads')
    @ApiOperation({ summary: 'NOTIFICAÇÕES NÃO LIDAS POR USUÁRIO' })
    async findAllUnreads(@Param('userId') userId: string): Promise<Notification[]> {
        return this.notificationService.findAllUnreads(userId);
    }

    @Patch(':notificationId/mark-read')
    @ApiOperation({ summary: 'MARCAR COMO LIDA' })
    async markOneRead(@Param('notificationId') notificationId: string): Promise<void> {
        await this.notificationService.markOneRead(notificationId);
    }

    @Patch(':userId/mark-all-read')
    @ApiOperation({ summary: 'MARCAR COMO LIDAS' })
    async markAllRead(@Param('userId') userId: string): Promise<void> {
        await this.notificationService.markAllRead(userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'DELETAR NOTIFICAÇÃO' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.notificationService.remove(id);
    }

}

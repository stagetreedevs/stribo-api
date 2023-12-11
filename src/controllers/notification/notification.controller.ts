/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { NotificationService } from './notification.service';
import { FilterNotificationDto, NotificationDto } from './notification.dto';
import { Notification } from './notification.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@ApiTags('NOTIFICAÇÕES')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'CRIAR NOTIFICAÇÃO' })
    @ApiBody({ type: NotificationDto })
    async create(@Body() content: Notification): Promise<Notification> {
        return this.notificationService.create(content);
    }

    @UseGuards(JwtAuthGuard)
    @Post('filter')
    @ApiOperation({ summary: 'FILTRO PARA NOTIFICAÇÕES' })
    @ApiBody({ type: FilterNotificationDto })
    async findFiltered(
        @Body() body: FilterNotificationDto,
    ): Promise<Notification[]> {
        return this.notificationService.findFiltered(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODAS NOTIFICAÇÕES' })
    async findAll(): Promise<Notification[]> {
        return this.notificationService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('animals')
    @ApiOperation({ summary: 'TODAS OS ANIMAIS' })
    async findAllAnimals(): Promise<string[]> {
        return this.notificationService.findAllAnimals();
    }

    @UseGuards(JwtAuthGuard)
    @Get('categories')
    @ApiOperation({ summary: 'TODAS AS CATEGORIAS' })
    async findAllCategories(): Promise<string[]> {
        return this.notificationService.findAllCategories();
    }

    @UseGuards(JwtAuthGuard)
    @Get('subCategories')
    @ApiOperation({ summary: 'TODAS AS SUBCATEGORIAS' })
    async findAllSubCategories(): Promise<string[]> {
        return this.notificationService.findAllSubCategories();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':notificationId')
    @ApiOperation({ summary: 'NOTIFICAÇÃO VIA ID' })
    async findOne(@Param('notificationId') notificationId: string): Promise<Notification> {
        return this.notificationService.findOne(notificationId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/all')
    @ApiOperation({ summary: 'NOTIFICAÇÕES LIDAS POR USUÁRIO' })
    async findUserNotification(@Param('userId') userId: string): Promise<Notification[]> {
        return this.notificationService.findUserNotification(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/reads')
    @ApiOperation({ summary: 'NOTIFICAÇÕES LIDAS POR USUÁRIO' })
    async findAllReads(@Param('userId') userId: string): Promise<Notification[]> {
        return this.notificationService.findAllReads(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/unreads')
    @ApiOperation({ summary: 'NOTIFICAÇÕES NÃO LIDAS POR USUÁRIO' })
    async findAllUnreads(@Param('userId') userId: string): Promise<Notification[]> {
        return this.notificationService.findAllUnreads(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':notificationId/mark-read')
    @ApiOperation({ summary: 'MARCAR COMO LIDA' })
    async markOneRead(@Param('notificationId') notificationId: string): Promise<void> {
        await this.notificationService.markOneRead(notificationId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':userId/mark-all-read')
    @ApiOperation({ summary: 'MARCAR COMO LIDAS' })
    async markAllRead(@Param('userId') userId: string): Promise<void> {
        await this.notificationService.markAllRead(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'DELETAR NOTIFICAÇÃO' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.notificationService.remove(id);
    }

}

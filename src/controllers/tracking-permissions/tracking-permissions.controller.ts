/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TrackingPermissionsDto, TrackingPermissionsEditDto } from './tracking-permissions.dto';
import { TrackingPermissions } from './tracking-permissions.entity';
import { TrackingPermissionsService } from './tracking-permissions.service';
@ApiTags('PERMISSÕES ACOMPANHAMENTO')
@ApiBearerAuth()
@Controller('tracking-permissions')
export class TrackingPermissionsController {
    constructor(private readonly permissionService: TrackingPermissionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'ADICIONAR PERMISSÕES DE ACOMPANHAMENTO' })
    @ApiBody({ type: TrackingPermissionsDto })
    async create(
        @Body() body: TrackingPermissions,
    ): Promise<TrackingPermissions> {
        return this.permissionService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':permission_id')
    @ApiOperation({ summary: 'OBTER PERMISSÕES DE ACOMPANHAMENTO DO USUÁRIO' })
    async findOne(@Param('permission_id') permission_id: string): Promise<TrackingPermissions> {
        return this.permissionService.findOne(permission_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    @ApiOperation({ summary: 'OBTER PERMISSÕES DE ACOMPANHAMENTO VIA EMAIL' })
    async findByUsername(@Param('username') username: string): Promise<TrackingPermissions> {
        return this.permissionService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':username')
    @ApiOperation({ summary: 'ATUALIZAR PERMISSÕES DE ACOMPANHAMENTO' })
    @ApiBody({ type: TrackingPermissionsEditDto })
    async update(
        @Param('username') username: string,
        @Body() body: TrackingPermissionsEditDto,
    ): Promise<TrackingPermissionsEditDto> {
        return this.permissionService.update(username, body);
    }
}
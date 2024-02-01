/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SportPermissionsDto, SportPermissionsEditDto } from './sport-permissions.dto';
import { SportPermissions } from './sport-permissions.entity';
import { SportPermissionsService } from './sport-permissions.service';
@ApiTags('PERMISSÕES ESPORTE')
@ApiBearerAuth()
@Controller('sport-permissions')
export class SportPermissionsController {
    constructor(private readonly permissionService: SportPermissionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'ADICIONAR PERMISSÕES DE CADASTRO' })
    @ApiBody({ type: SportPermissionsDto })
    async create(
        @Body() body: SportPermissions,
    ): Promise<SportPermissions> {
        return this.permissionService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':permission_id')
    @ApiOperation({ summary: 'OBTER PERMISSÕES DE CADASTRO DO USUÁRIO' })
    async findOne(@Param('permission_id') permission_id: string): Promise<SportPermissions> {
        return this.permissionService.findOne(permission_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    @ApiOperation({ summary: 'OBTER PERMISSÕES DE CADASTRO VIA EMAIL' })
    async findByUsername(@Param('username') username: string): Promise<SportPermissions> {
        return this.permissionService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':username')
    @ApiOperation({ summary: 'ATUALIZAR PERMISSÕES DE CADASTRO' })
    @ApiBody({ type: SportPermissionsEditDto })
    async update(
        @Param('username') username: string,
        @Body() body: SportPermissionsEditDto,
    ): Promise<SportPermissionsEditDto> {
        return this.permissionService.update(username, body);
    }
}
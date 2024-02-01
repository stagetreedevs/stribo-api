/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RegistrationPermissionsService } from './registration-permissions.service';
import { RegistrationPermissionsDto, RegistrationPermissionsEditDto } from './registration-permissions.dto';
import { RegistrationPermissions } from './registration-permissions.entity';
@ApiTags('PERMISSÕES CADASTRO')
@ApiBearerAuth()
@Controller('registration-permissions')
export class RegistrationPermissionsController {
    constructor(private readonly permissionService: RegistrationPermissionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'ADICIONAR PERMISSÕES DE CADASTRO' })
    @ApiBody({ type: RegistrationPermissionsDto })
    async create(
        @Body() body: RegistrationPermissions,
    ): Promise<RegistrationPermissions> {
        return this.permissionService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':permission_id')
    @ApiOperation({ summary: 'OBTER PERMISSÕES DE CADASTRO DO USUÁRIO' })
    async findOne(@Param('permission_id') permission_id: string): Promise<RegistrationPermissions> {
        return this.permissionService.findOne(permission_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    @ApiOperation({ summary: 'OBTER PERMISSÕES DE CADASTRO VIA EMAIL' })
    async findByUsername(@Param('username') username: string): Promise<RegistrationPermissions> {
        return this.permissionService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':username')
    @ApiOperation({ summary: 'ATUALIZAR PERMISSÕES DE CADASTRO' })
    @ApiBody({ type: RegistrationPermissionsEditDto })
    async update(
        @Param('username') username: string,
        @Body() body: RegistrationPermissionsEditDto,
    ): Promise<RegistrationPermissionsEditDto> {
        return this.permissionService.update(username, body);
    }
}
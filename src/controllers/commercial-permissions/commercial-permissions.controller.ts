/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommercialPermissionsDto, CommercialPermissionsEditDto } from './commercial-permissions.dto';
import { CommercialPermissions } from './commercial-permissions.entity';
import { CommercialPermissionsService } from './commercial-permissions.service';
@ApiTags('PERMISSÕES COMÉRCIAL')
@ApiBearerAuth()
@Controller('commercial-permissions')
export class CommercialPermissionsController {
    constructor(private readonly permissionService: CommercialPermissionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'ADICIONAR PERMISSÕES COMEERCIAIS' })
    @ApiBody({ type: CommercialPermissionsDto })
    async create(
        @Body() body: CommercialPermissions,
    ): Promise<CommercialPermissions> {
        return this.permissionService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':permission_id')
    @ApiOperation({ summary: 'OBTER PERMISSÕES COMEERCIAIS DO USUÁRIO' })
    async findOne(@Param('permission_id') permission_id: string): Promise<CommercialPermissions> {
        return this.permissionService.findOne(permission_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    @ApiOperation({ summary: 'OBTER PERMISSÕES COMEERCIAIS VIA EMAIL' })
    async findByUsername(@Param('username') username: string): Promise<CommercialPermissions> {
        return this.permissionService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':username')
    @ApiOperation({ summary: 'ATUALIZAR PERMISSÕES COMEERCIAIS' })
    @ApiBody({ type: CommercialPermissionsEditDto })
    async update(
        @Param('username') username: string,
        @Body() body: CommercialPermissionsEditDto,
    ): Promise<CommercialPermissionsEditDto> {
        return this.permissionService.update(username, body);
    }
}
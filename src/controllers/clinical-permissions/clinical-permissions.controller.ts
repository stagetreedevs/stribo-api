/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ClinicalPermissionsDto, ClinicalPermissionsEditDto } from './clinical-permissions.dto';
import { ClinicalPermissions } from './clinical-permissions.entity';
import { ClinicalPermissionsService } from './clinical-permissions.service';
@ApiTags('PERMISSÕES CLÍNICAS')
@ApiBearerAuth()
@Controller('clinical-permissions')
export class ClinicalPermissionsController {
    constructor(private readonly permissionService: ClinicalPermissionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'ADICIONAR PERMISSÕES CLÍNICAS' })
    @ApiBody({ type: ClinicalPermissionsDto })
    async create(
        @Body() body: ClinicalPermissions,
    ): Promise<ClinicalPermissions> {
        return this.permissionService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':permission_id')
    @ApiOperation({ summary: 'OBTER PERMISSÕES CLÍNICAS DO USUÁRIO' })
    async findOne(@Param('permission_id') permission_id: string): Promise<ClinicalPermissions> {
        return this.permissionService.findOne(permission_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    @ApiOperation({ summary: 'OBTER PERMISSÕES CLÍNICAS VIA EMAIL' })
    async findByUsername(@Param('username') username: string): Promise<ClinicalPermissions> {
        return this.permissionService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':username')
    @ApiOperation({ summary: 'ATUALIZAR PERMISSÕES CLÍNICAS' })
    @ApiBody({ type: ClinicalPermissionsEditDto })
    async update(
        @Param('username') username: string,
        @Body() body: ClinicalPermissionsEditDto,
    ): Promise<ClinicalPermissionsEditDto> {
        return this.permissionService.update(username, body);
    }
}
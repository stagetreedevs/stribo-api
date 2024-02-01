/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FinancialPermissionsDto, FinancialPermissionsEditDto } from './financial-permissions.dto';
import { FinancialPermissions } from './financial-permissions.entity';
import { FinancialPermissionsService } from './financial-permissions.service';
@ApiTags('PERMISSÕES FINANCEIRO')
@ApiBearerAuth()
@Controller('financial-permissions')
export class FinancialPermissionsController {
    constructor(private readonly permissionService: FinancialPermissionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'ADICIONAR PERMISSÕES FINANCEIRAS' })
    @ApiBody({ type: FinancialPermissionsDto })
    async create(
        @Body() body: FinancialPermissions,
    ): Promise<FinancialPermissions> {
        return this.permissionService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':permission_id')
    @ApiOperation({ summary: 'OBTER PERMISSÕES FINANCEIRAS DO USUÁRIO' })
    async findOne(@Param('permission_id') permission_id: string): Promise<FinancialPermissions> {
        return this.permissionService.findOne(permission_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    @ApiOperation({ summary: 'OBTER PERMISSÕES FINANCEIRAS VIA EMAIL' })
    async findByUsername(@Param('username') username: string): Promise<FinancialPermissions> {
        return this.permissionService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':username')
    @ApiOperation({ summary: 'ATUALIZAR PERMISSÕES FINANCEIRAS' })
    @ApiBody({ type: FinancialPermissionsEditDto })
    async update(
        @Param('username') username: string,
        @Body() body: FinancialPermissionsEditDto,
    ): Promise<FinancialPermissionsEditDto> {
        return this.permissionService.update(username, body);
    }
}
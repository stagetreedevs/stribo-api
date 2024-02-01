/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PurchasesPermissionsDto, PurchasesPermissionsEditDto } from './purchases-permissions.dto';
import { PurchasesPermissions } from './purchases-permissions.entity';
import { PurchasesPermissionsService } from './purchases-permissions.service';
@ApiTags('PERMISSÕES COMPRAS')
@ApiBearerAuth()
@Controller('purchases-permissions')
export class PurchasesPermissionsController {
    constructor(private readonly permissionService: PurchasesPermissionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'ADICIONAR PERMISSÕES DE COMPRA' })
    @ApiBody({ type: PurchasesPermissionsDto })
    async create(
        @Body() body: PurchasesPermissions,
    ): Promise<PurchasesPermissions> {
        return this.permissionService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':permission_id')
    @ApiOperation({ summary: 'OBTER PERMISSÕES DE COMPRA DO USUÁRIO' })
    async findOne(@Param('permission_id') permission_id: string): Promise<PurchasesPermissions> {
        return this.permissionService.findOne(permission_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    @ApiOperation({ summary: 'OBTER PERMISSÕES DE COMPRA VIA EMAIL' })
    async findByUsername(@Param('username') username: string): Promise<PurchasesPermissions> {
        return this.permissionService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':username')
    @ApiOperation({ summary: 'ATUALIZAR PERMISSÕES DE COMPRA' })
    @ApiBody({ type: PurchasesPermissionsEditDto })
    async update(
        @Param('username') username: string,
        @Body() body: PurchasesPermissionsEditDto,
    ): Promise<PurchasesPermissionsEditDto> {
        return this.permissionService.update(username, body);
    }
}
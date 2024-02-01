/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReproductivePermissionsDto, ReproductivePermissionsEditDto } from './reproductive-permissions.dto';
import { ReproductivePermissions } from './reproductive-permissions.entity';
import { ReproductivePermissionsService } from './reproductive-permissions.service';
@ApiTags('PERMISSÕES REPRODUTIVAS')
@ApiBearerAuth()
@Controller('reproductive-permissions')
export class ReproductivePermissionsController {
    constructor(private readonly permissionService: ReproductivePermissionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'ADICIONAR PERMISSÕES REPRODUTIVAS' })
    @ApiBody({ type: ReproductivePermissionsDto })
    async create(
        @Body() body: ReproductivePermissions,
    ): Promise<ReproductivePermissions> {
        return this.permissionService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':permission_id')
    @ApiOperation({ summary: 'OBTER PERMISSÕES REPRODUTIVAS DO USUÁRIO' })
    async findOne(@Param('permission_id') permission_id: string): Promise<ReproductivePermissions> {
        return this.permissionService.findOne(permission_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    @ApiOperation({ summary: 'OBTER PERMISSÕES REPRODUTIVAS VIA EMAIL' })
    async findByUsername(@Param('username') username: string): Promise<ReproductivePermissions> {
        return this.permissionService.findByUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':username')
    @ApiOperation({ summary: 'ATUALIZAR PERMISSÕES REPRODUTIVAS' })
    @ApiBody({ type: ReproductivePermissionsEditDto })
    async update(
        @Param('username') username: string,
        @Body() body: ReproductivePermissionsEditDto,
    ): Promise<ReproductivePermissionsEditDto> {
        return this.permissionService.update(username, body);
    }
}
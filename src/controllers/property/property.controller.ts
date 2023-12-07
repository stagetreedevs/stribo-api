/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, Patch } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Property } from './property.entity';
import { PropertyDto } from './property.dto';
import { AdminPropertyDto } from './admin-property.dto';
import { PropertyService } from './property.service';
import { UpdatePropertyDto } from './update-property.dto';
@ApiTags('PROPRIEDADE')
@Controller('property')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) { }

    @Post()
    @ApiOperation({ summary: 'CRIAR PROPRIEDADE' })
    @ApiBody({ type: PropertyDto })
    async create(
        @Body() body: Property,
    ): Promise<Property> {
        return this.propertyService.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'TODAS PROPRIEDADES' })
    async findAll(): Promise<Property[]> {
        return this.propertyService.findAll();
    }

    @Get('user/:userId/properties')
    @ApiOperation({ summary: 'BUSCAR TODAS AS PROPRIEDADES DE UM USUÁRIO' })
    async findAllUserProperties(@Param('userId') userId: string): Promise<Property[]> {
        return this.propertyService.findAllUserProperties(userId);
    }

    @Get('admin/:adminId/properties')
    @ApiOperation({ summary: 'BUSCAR PROPRIEDADES DE UM ADMINISTRADOR' })
    async findByAdmin(@Param('adminId') adminId: string): Promise<Property[]> {
        return this.propertyService.findByAdmin(adminId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'BUSCAR PROPRIEDADE' })
    async findOne(@Param('id') id: string): Promise<Property> {
        return this.propertyService.findOne(id);
    }

    @Get(':id/admins')
    @ApiOperation({ summary: 'RETORNA ADMINS DE UMA PROPRIEDADE' })
    async findAdminsForProperty(@Param('id') id: string): Promise<any[]> {
        return this.propertyService.findAdminsForProperty(id);
    }

    @Patch(':id/admins/add')
    @ApiOperation({ summary: 'ADICIONAR ADMIN A UMA PROPRIEDADE' })
    @ApiBody({ type: AdminPropertyDto })
    async addAdmin(@Param('id') id: string, @Body('adminId') adminId: string): Promise<Property> {
        return this.propertyService.addAdmins(id, adminId);
    }

    @Patch(':id/admins/remove')
    @ApiOperation({ summary: 'REMOVER ADMIN DE UMA PROPRIEDADE' })
    @ApiBody({ type: AdminPropertyDto })
    async removeAdmin(@Param('id') id: string, @Body('adminId') adminId: string): Promise<Property> {
        return this.propertyService.removeAdmin(id, adminId);
    }

    @Put(':id/inputs')
    @ApiOperation({ summary: 'ATUALIZAR PROPRIEDADE (NOME E CÓDIGO)' })
    @ApiBody({ type: UpdatePropertyDto })
    async updateInputs(@Param('id') id: string, @Body() body: Property): Promise<Property> {
        return this.propertyService.updateInputs(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'DELETAR PROPRIEDADE' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.propertyService.remove(id);
    }
}

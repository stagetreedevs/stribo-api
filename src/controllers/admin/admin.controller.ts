/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminDto } from './admin.dto';
import { Admin } from './admin.entity';
@ApiTags('Administrador')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    @ApiOperation({ summary: 'CRIAR ADMIN', description: 'PASSE O BODY PREENCHIDO E CRIE UM ADMIN.' })
    @ApiBody({ type: AdminDto })
    async create(@Body() admin: Admin): Promise<Admin> {
        return this.adminService.create(admin);
    }

    @Get()
    @ApiOperation({ summary: 'TODOS ADMINS', description: 'RETORNA TODOS OS ADMINS.' })
    async findAll(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'BUSCAR ADMIN', description: 'PASSE COMO PARAMETRO O ID E RETORNE UM ADMIN.' })
    async findOne(@Param('id') id: string): Promise<Admin> {
        return this.adminService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'EDITAR ADMIN', description: 'PASSE COMO PARAMETRO O ID E UM BODY CONTENDO INFORMAÇÕES PARA ATAULIZAR O.' })
    async update(@Param('id') id: string, @Body() admin: Admin): Promise<Admin> {
        return this.adminService.update(id, admin);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'DELETAR ADMIN', description: 'PASSE COMO PARAMETRO O ID E DELETE UM ADMIN.' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.adminService.remove(id);
    }

}

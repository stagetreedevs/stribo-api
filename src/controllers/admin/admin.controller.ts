/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminDto } from './admin.dto';
import { Admin } from './admin.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAdminDto, UpdateAdminFirstLoginDto } from './update-admin.dto';
@ApiTags('ADMIN')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post(':propertyId')
    @ApiOperation({ summary: 'CRIAR ADMIN' })
    @ApiBody({ type: AdminDto })
    // @ApiConsumes('multipart/form-data')
    async create(
        @Body() body: AdminDto,
        @Param('propertyId') propertyId: string,
    ): Promise<Admin> {
        return this.adminService.create(body, propertyId);
    }

    @Get()
    @ApiOperation({ summary: 'TODOS ADMINS' })
    async findAll(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'BUSCAR ADMIN' })
    async findOne(@Param('id') id: string): Promise<Admin> {
        return this.adminService.findOne(id);
    }

    @Get(':id/password')
    @ApiOperation({ summary: 'REDEFINIR SENHA DE UM ADMIN' })
    async passwordRecover(@Param('id') id: string): Promise<Admin> {
        return this.adminService.passwordRecover(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'EDITAR ADMIN' })
    @ApiBody({ type: UpdateAdminDto })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string,
        @UploadedFile() image: Express.Multer.File,
        @Body() body: UpdateAdminDto,
    ): Promise<Admin> {
        return this.adminService.update(id, body, image);
    }

    @Patch(':id/firstLogin')
    @ApiBody({ type: UpdateAdminFirstLoginDto })
    @ApiOperation({ summary: 'ATUALIZAR SENHA E NOME DO ADMIN NO PROMEIRO LOGIN' })
    async firstLogin(@Param('id') id: string, @Body() body: UpdateAdminFirstLoginDto): Promise<Admin> {
        return this.adminService.firstLogin(id, body.newPassword, body.name);
    }

    @Patch(':id/password')
    @ApiOperation({ summary: 'ATUALIZAR SENHA DO ADMIN' })
    async updatePassword(@Param('id') id: string, @Body('newPassword') newPassword: string): Promise<Admin> {
        return this.adminService.updatePassword(id, newPassword);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'DELETAR ADMIN' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.adminService.remove(id);
    }
}

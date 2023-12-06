/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto, UpdateUserFirstLoginDto } from './update-user.dto';
@ApiTags('USUÁRIOS')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'CRIAR USUÁRIO' })
  @ApiBody({ type: UserDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: User,
  ): Promise<User> {
    return this.userService.create(body, image);
  }

  @Get()
  @ApiOperation({ summary: 'TODOS USUÁRIOS' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'BUSCAR USUÁRIO VIA ID' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'EDITAR USUÁRIO' })
  @ApiBody({ type: UpdateUserDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, body, image);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'ATUALIZAR SENHA DO USUÁRIO' })
  async updatePassword(@Param('id') id: string, @Body('newPassword') newPassword: string): Promise<User> {
    return this.userService.updatePassword(id, newPassword);
  }

  @Patch(':id/firstLogin')
  @ApiBody({ type: UpdateUserFirstLoginDto })
  @ApiOperation({ summary: 'ATUALIZAR SENHA E NOME DO USUÁRIO NO PROMEIRO LOGIN' })
  async firstLogin(@Param('id') id: string, @Body() body: UpdateUserFirstLoginDto): Promise<User> {
    return this.userService.fistLogin(id, body.newPassword, body.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'DELETAR USUÁRIO' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

}

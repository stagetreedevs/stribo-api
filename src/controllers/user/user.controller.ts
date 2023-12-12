/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, Patch, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto, UserGoogleDto } from './user.dto';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePasswordDto, UpdateUserDto, UpdateUserFirstLoginDto } from './update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@ApiTags('USUÁRIOS')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
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

  @Post('auth-db')
  @ApiOperation({ summary: 'VERIFICA DADOS RETORNADOS DA API DE LOGIN GOOGLE' })
  @ApiBody({ type: UserGoogleDto })
  async authDatabase(
    @Body() body: UserGoogleDto,
  ) {
    return this.userService.authDatabase(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS USUÁRIOS' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'BUSCAR USUÁRIO VIA ID' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email/password')
  @ApiOperation({ summary: 'REDEFINIR SENHA DE UM USUÁRIO' })
  async passwordRecover(@Param('email') email: string): Promise<User> {
    return this.userService.passwordRecover(email);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'EDITAR USUÁRIO' })
  @ApiBody({ type: UpdateUserDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UpdateUserDto,
  ): Promise<any> {
    return this.userService.update(id, body, image);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  @ApiOperation({ summary: 'ATUALIZAR SENHA DO USUÁRIO' })
  @ApiBody({ type: UpdatePasswordDto })
  async updatePassword(@Param('id') id: string, @Body('newPassword') newPassword: string): Promise<any> {
    return this.userService.updatePassword(id, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/firstLogin')
  @ApiBody({ type: UpdateUserFirstLoginDto })
  @ApiOperation({ summary: 'ATUALIZAR SENHA E NOME DO USUÁRIO NO PROMEIRO LOGIN' })
  async firstLogin(@Param('id') id: string, @Body() body: UpdateUserFirstLoginDto): Promise<any> {
    return this.userService.fistLogin(id, body.newPassword, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'DELETAR USUÁRIO' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

}

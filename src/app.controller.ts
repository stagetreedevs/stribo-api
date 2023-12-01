/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, UseGuards, Post, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { LoginDto } from './login.dto';
import { GoogleService } from './auth-google/google.service';
@ApiTags('API')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly googleService: GoogleService,
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'LOGIN PADRÃO', description: 'PASSE O BODY PREENCHIDO E OBTENHA COMO RESPOSTA UM TOKEN JWT CONTENDO INFORMAÇÕES SOBRE O USUÁRIO. O TOKEN TEM VALIDADE DE 1 DIA.' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return req.user;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login-google')
  @ApiOperation({ summary: 'LOGIN/CADASTRO GOOGLE', description: 'ABRE UMA TELA DE REDIRECIONAMENTO GOOGLE' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) { }

  @Get('auth/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req) {
    return this.googleService.googleLogin(req)
  }

}
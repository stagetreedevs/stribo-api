/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/controllers/user/user.module';
import { AdminModule } from 'src/controllers/admin/admin.module';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    UserModule,
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule { }
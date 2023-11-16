/* eslint-disable prettier/prettier */
import { AdminModule } from './controllers/admin/admin.module';
import { UserModule } from './controllers/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { GoogleModule } from './auth-google/google.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { SwaggerModule } from '@nestjs/swagger';
import { Admin } from './controllers/admin/admin.entity';
import { User } from './controllers/user/user.entity';
import { environment } from './environment';
@Module({
  imports: [
    AdminModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.PG_HOST,
      port: environment.PG_PORT,
      username: environment.PG_USER,
      password: environment.PG_PASSWORD,
      database: environment.PG_DATABASE,
      entities: [
        Admin,
        User
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: { expiresIn: '24h' },
    }),
    SwaggerModule,
    GoogleModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
  ]
})
export class AppModule { }
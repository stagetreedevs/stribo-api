/* eslint-disable prettier/prettier */
import { UserModule } from './controllers/user/user.module';
import { AdminModule } from './controllers/admin/admin.module';
import { NotificationModule } from './controllers/notification/notification.module';
import { PropertyModule } from './controllers/property/property.module';
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
import { Notification } from './controllers/notification/notification.entity';
import { S3Module } from './controllers/s3/s3.module';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
        PropertyModule, 
    S3Module,
    NotificationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [
        Admin,
        User,
        Notification
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
    AuthModule,
    UserModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
  ]
})
export class AppModule { }
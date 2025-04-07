/* eslint-disable prettier/prettier */
import { RegistrationPermissionsModule } from './controllers/registration-permissions/registration-permissions.module';
import { BiometryModule } from './controllers/biometry/biometry.module';
import { DeathModule } from './controllers/death/death.module';
import { NutritionalModule } from './controllers/nutritional/nutritional.module';
import { UserModule } from './controllers/user/user.module';
import { AdminModule } from './controllers/admin/admin.module';
import { AnimalModule } from './controllers/animal/animal.module';
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
import { Property } from './controllers/property/property.entity';
import { Animal } from './controllers/animal/animal.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { Nutritional } from './controllers/nutritional/nutritional.entity';
import { Death } from './controllers/death/death.entity';
import { ProcedureModule } from './controllers/procedure/procedure.module';
import { ClinicalPermissionsModule } from './controllers/clinical-permissions/clinical-permissions.module';
import { CommercialPermissionsModule } from './controllers/commercial-permissions/commercial-permissions.module';
import { FinancialPermissionsModule } from './controllers/financial-permissions/financial-permissions.module';
import { PurchasesPermissionsModule } from './controllers/purchases-permissions/purchases-permissions.module';
import { ReproductivePermissionsModule } from './controllers/reproductive-permissions/reproductive-permissions.module';
import { SportPermissionsModule } from './controllers/sport-permissions/sport-permissions.module';
import { TrackingPermissionsModule } from './controllers/tracking-permissions/tracking-permissions.module';
import { ProviderModule } from './controllers/provider/provider.module';
import { BudgetModule } from './controllers/documents/budget/budget.module';
import { ReceiptModule } from './controllers/documents/receipt/receipt.module';
import { ServiceOrderModule } from './controllers/documents/service-order/service-order.module';
import { InvoiceModule } from './controllers/documents/invoice/invoice.module';
import { ContractModule } from './controllers/documents/contract/contract.module';
import { BankSlipModule } from './controllers/documents/bank-slip/bank-slip.module';
import { AnimalDocumentModule } from './controllers/animal/documents/animal-document.module';
import { ForSaleModule } from './controllers/animal/comercial/forSale.module';
import { ReproductiveModule } from './controllers/reproductive/reproductive.module';
import { Reproductive } from './controllers/reproductive/reproductive.entity';
import { SemenShipping } from './controllers/semen-shipping/semen-shipping.entity';
import { SemenShippingModule } from './controllers/semen-shipping/semen-shipping.module';
import { SemenReceiptModule } from './controllers/semen-receipt/semen-receipt.module';
import { SemenReceipt } from './controllers/semen-receipt/semen-receipt.entity';
import { SemenFrozenModule } from './controllers/semen-frozen/semen-frozen.module';
import { Cylinder } from './controllers/cylinder/cylinder.entity';
import { CylinderModule } from './controllers/cylinder/cylinder.module';
import { SemenFrozen } from './controllers/semen-frozen/semen-frozen.entity';
import { CompetitionModule } from './controllers/competition/competition.module';
import { Competition } from './controllers/competition/competition.entity';
import { FinancialModule } from './controllers/financial/financial.module';
import { BankAccount } from './controllers/financial/entity/bank-account.entity';
import { Category } from './controllers/financial/entity/category.entity';
import { Competitor } from './controllers/competition/competitor.entity';
import { PropertiesModule } from './controllers/properties/properties.module';
import { ProductsEntity } from './controllers/properties/entity/products.entity';
import { MovementsEntity } from './controllers/properties/entity/movements.entity';
dotenv.config();
@Module({
  imports: [
    ClinicalPermissionsModule,
    CommercialPermissionsModule,
    FinancialPermissionsModule,
    PurchasesPermissionsModule,
    RegistrationPermissionsModule,
    ReproductivePermissionsModule,
    RegistrationPermissionsModule,
    SportPermissionsModule,
    TrackingPermissionsModule,
    ProcedureModule,
    BiometryModule,
    DeathModule,
    NutritionalModule,
    AnimalModule,
    PropertyModule,
    S3Module,
    NotificationModule,
    ProviderModule,
    BudgetModule,
    ReceiptModule,
    ServiceOrderModule,
    InvoiceModule,
    ContractModule,
    BankSlipModule,
    AnimalDocumentModule,
    ForSaleModule,
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
        Notification,
        Property,
        Animal,
        Nutritional,
        Death,
        Reproductive,
        SemenShipping,
        SemenReceipt,
        SemenFrozen,
        Cylinder,
        Competition,
        Competitor,
        BankAccount,
        Category,
        ProductsEntity,
        MovementsEntity,
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_SECRET_KEY,
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: { expiresIn: '24h' },
    }),
    SwaggerModule,
    GoogleModule,
    AuthModule,
    UserModule,
    AdminModule,
    ReproductiveModule,
    SemenShippingModule,
    SemenReceiptModule,
    SemenFrozenModule,
    CylinderModule,
    CompetitionModule,
    FinancialModule,
    PropertiesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}

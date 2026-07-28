/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './provider.entity';
import { SupplierType } from './supplier-type.entity';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { AsaasModule } from 'src/services/asaas/asaas.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Provider, SupplierType]),
        AsaasModule,
    ],
    controllers: [ProviderController],
    providers: [ProviderService],
    exports: [ProviderService]
})
export class ProviderModule { }
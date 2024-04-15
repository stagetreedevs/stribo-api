/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './provider.entity';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([Provider]),
    ],
    controllers: [ProviderController],
    providers: [ProviderService],
    exports: [ProviderService]
})
export class ProviderModule { }
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrder } from './service-order.entity';
import { ServiceOrderController } from './service-order.controller';
import { ServiceOrderService } from './service-order.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([ServiceOrder])
    ],
    controllers: [ServiceOrderController],
    providers: [ServiceOrderService],
    exports: [ServiceOrderService]
})
export class ServiceOrderModule { }
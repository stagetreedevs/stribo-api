import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from './entity/products.entity';
import { MovementsEntity } from './entity/movements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsEntity, MovementsEntity])],
  providers: [PropertiesService],
})
export class PropertiesModule {}

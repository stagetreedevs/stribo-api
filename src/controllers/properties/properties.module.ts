import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from './entity/products.entity';
import { MovementsEntity } from './entity/movements.entity';
import { PropertiesController } from './properties.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsEntity, MovementsEntity])],
  providers: [PropertiesService],
  controllers: [PropertiesController],
})
export class PropertiesModule {}

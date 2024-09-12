import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReproductiveService } from './reproductive.service';
import { ReproductiveController } from './reproductive.controller';
import { AnimalModule } from '../animal/animal.module';
import { Reproductive } from './reproductive.entity';
import { SemenShippingModule } from '../semen-shipping/semen-shipping.module';
import { SemenReceiptModule } from '../semen-receipt/semen-receipt.module';
import { SemenFrozenModule } from '../semen-frozen/semen-frozen.module';
import { CylinderModule } from '../cylinder/cylinder.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reproductive]),
    AnimalModule,
    SemenShippingModule,
    SemenReceiptModule,
    SemenFrozenModule,
    CylinderModule,
  ],
  providers: [ReproductiveService],
  controllers: [ReproductiveController],
})
export class ReproductiveModule {}

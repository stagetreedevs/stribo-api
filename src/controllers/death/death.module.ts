/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Death } from './death.entity';
import { DeathController } from './death.controller';
import { DeathService } from './death.service';
import { AnimalModule } from '../animal/animal.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Death]),
        forwardRef(() => AnimalModule),
    ],
    controllers: [DeathController],
    providers: [DeathService],
    exports: [DeathService]
})
export class DeathModule { }

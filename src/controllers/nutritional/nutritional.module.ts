/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nutritional } from './nutritional.entity';
import { NutritionalService } from './nutritional.service';
import { NutritionalController } from './nutritional.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([Nutritional]),
    ],
    controllers: [NutritionalController],
    providers: [NutritionalService],
    exports: [NutritionalService]
})
export class NutritionalModule { }

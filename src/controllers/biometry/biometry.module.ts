/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalModule } from '../animal/animal.module';
import { Biometry } from './biometry.entity';
import { BiometryController } from './biometry.controller';
import { BiometryService } from './biometry.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([Biometry]),
        forwardRef(() => AnimalModule),
    ],
    controllers: [BiometryController],
    providers: [BiometryService],
    exports: [BiometryService]
})
export class BiometryModule { }

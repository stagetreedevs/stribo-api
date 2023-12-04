/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property } from './property.entity';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Property]),
        UserModule,
        forwardRef(() => AdminModule)
    ],
    controllers: [PropertyController],
    providers: [PropertyService],
    exports: [PropertyService]
})
export class PropertyModule { }

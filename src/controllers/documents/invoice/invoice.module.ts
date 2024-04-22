/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([Invoice])
    ],
    controllers: [InvoiceController],
    providers: [InvoiceService],
    exports: [InvoiceService]
})
export class InvoiceModule { }
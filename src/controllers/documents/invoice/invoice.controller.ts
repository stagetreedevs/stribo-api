/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InvoiceService } from './invoice.service';
import { InvoiceDto, InvoiceEditDto } from './invoice.dto';
import { FilterDocumentsDto } from '../documents.dto';
@ApiTags('DOCUMENTO - NOTA FISCAL')
@ApiBearerAuth()
@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'REGISTRAR DADOS DE UMA NOTA FISCAL' })
    @ApiBody({ type: InvoiceDto })
    async create(
        @Body() body: InvoiceDto,
    ): Promise<any> {
        return this.invoiceService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('filter')
    @ApiOperation({ summary: 'FILTRO PARA NOTA FISCAL' })
    @ApiBody({ type: FilterDocumentsDto })
    async findFiltered(
        @Body() body: FilterDocumentsDto,
    ): Promise<any[]> {
        return this.invoiceService.findFiltered(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODAS NOTAS FISCAIS REGISTRADAS' })
    async findAll(): Promise<any> {
        return this.invoiceService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':invoice_number/number')
    @ApiOperation({ summary: 'NOTA FISCAL VIA NUMERO DE NOTA FISCAL' })
    async findByNumber(
        @Param('invoice_number') invoice_number: string
    ): Promise<any> {
        return this.invoiceService.findByNumber(invoice_number);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':invoice_number/property')
    @ApiOperation({ summary: 'NOTA FISCAL VIA PROPRIEDADE' })
    async findByProperty(
        @Param('invoice_number') invoice_number: string
    ): Promise<any> {
        return this.invoiceService.findByProperty(invoice_number);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':invoice_number')
    @ApiOperation({ summary: 'EDITAR NOTA FISCAL' })
    @ApiBody({ type: InvoiceEditDto })
    async update(
        @Param('invoice_number') invoice_number: string,
        @Body() body: InvoiceEditDto
    ): Promise<any> {
        return this.invoiceService.update(invoice_number, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':invoice_number')
    @ApiOperation({ summary: 'DELETAR NOTA FISCAL' })
    async delete(
        @Param('invoice_number') invoice_number: string
    ): Promise<void> {
        return this.invoiceService.delete(invoice_number);
    }

}

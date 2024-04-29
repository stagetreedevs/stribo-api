/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ForSaleService } from './forSale.service';
import { ForSaleDto, ForSaleEditDto } from './forSale.dto';
@ApiTags('COMERCIAL - ANIMAIS À VENDA')
@ApiBearerAuth()
@Controller('sale')
export class ForSaleController {
    constructor(private readonly saleService: ForSaleService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'REGISTRAR ANIMAL A VENDA' })
    @ApiBody({ type: ForSaleDto })
    async create(
        @Body() body: ForSaleDto
    ): Promise<any> {
        return this.saleService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODOS ANIMAIS A VENDA' })
    async findAll(): Promise<any[]> {
        return this.saleService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':animal_id')
    @ApiOperation({ summary: 'BUSCAR ANIMAL A VENDA VIA ID' })
    async findByAnimal(
        @Param('animal_id') animal_id: string
    ): Promise<any> {
        return this.saleService.findByAnimal(animal_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':property_id/property')
    @ApiOperation({ summary: 'TODOS ANIMAIS A VENDA, INDICANDO AQUELES QUE SÃO DA PROPRIEDADE COM A VARIÁVEL MARKETABLE' })
    async findByPropertyIndication(
        @Param('property_id') property_id: string
    ): Promise<any[]> {
        return this.saleService.findByPropertyIndication(property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':sale_id')
    @ApiOperation({ summary: 'EDITAR BOLETO' })
    @ApiBody({ type: ForSaleEditDto })
    async update(
        @Param('sale_id') sale_id: string,
        @Body() body: ForSaleEditDto
    ): Promise<any> {
        return this.saleService.update(sale_id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':sale_id/:property_id')
    @ApiOperation({ summary: 'DELETAR ANIMAL A VENDA' })
    async remove(
        @Param('sale_id') sale_id: string,
        @Param('property_id') property_id: string
    ): Promise<void> {
        return this.saleService.remove(sale_id, property_id);
    }

}
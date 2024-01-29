/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NutritionalService } from './nutritional.service';
import { NutritionalDto } from './nutritional.dto';
import { Nutritional } from './nutritional.entity';
@ApiTags('MANEJO NUTRICIONAL')
@ApiBearerAuth()
@Controller('nutritional')
export class NutritionalController {
    constructor(private readonly nutriService: NutritionalService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'ADICIONAR PRODUTO AO MANEJO NUTRICIONAL' })
    @ApiBody({ type: NutritionalDto })
    async create(
        @Body() body: Nutritional,
    ): Promise<Nutritional> {
        return this.nutriService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODOS PRODUTOS CADASTRADOS PARA MANEJO' })
    async findAll(): Promise<Nutritional[]> {
        return this.nutriService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':animal_id')
    @ApiOperation({ summary: 'MANEJO COMPLETO DE UM ANIMAL' })
    async findByAnimal(@Param('animal_id') animal_id: string): Promise<Nutritional[]> {
        return this.nutriService.findByAnimal(animal_id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':product_id')
    @ApiOperation({ summary: 'EDITAR PRODUTO DO MANEJO' })
    @ApiBody({ type: NutritionalDto })
    async update(@Param('product_id') product_id: string, @Body() body: Nutritional): Promise<Nutritional> {
        return this.nutriService.update(product_id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('produto/:product_id')
    @ApiOperation({ summary: 'DELETAR PRODUTO DO MANEJO' })
    async removeProduct(@Param('product_id') product_id: string): Promise<void> {
        return this.nutriService.removeProduct(product_id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('manejo/:animal_id')
    @ApiOperation({ summary: 'DELETAR MANEJO NUTRICIONAL DE UM ANIMAL' })
    async removeManagement(@Param('animal_id') animal_id: string): Promise<void> {
        return this.nutriService.removeManagement(animal_id);
    }
}

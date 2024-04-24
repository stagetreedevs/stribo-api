/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BudgetService } from './budget.service';
import { BudgetDto, BudgetEditDto } from './budget.dto';
import { FilterDocumentsDto } from '../documents.dto';
@ApiTags('DOCUMENTO - ORÇAMENTO')
@ApiBearerAuth()
@Controller('budget')
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'REGISTRAR DADOS DE UM ORÇAMENTO' })
    @ApiBody({ type: BudgetDto })
    async create(
        @Body() body: BudgetDto,
    ): Promise<any> {
        return this.budgetService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('filter')
    @ApiOperation({ summary: 'FILTRO PARA ORÇAMENTO' })
    @ApiBody({ type: FilterDocumentsDto })
    async findFiltered(
        @Body() body: FilterDocumentsDto,
    ): Promise<any[]> {
        return this.budgetService.findFiltered(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODOS ORÇAMENTOS REGISTRADOS' })
    async findAll(): Promise<any> {
        return this.budgetService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':budget_number/number')
    @ApiOperation({ summary: 'ORÇAMENTO VIA NUMERO DE ORÇAMENTO' })
    async findByNumber(
        @Param('budget_number') budget_number: string
    ): Promise<any> {
        return this.budgetService.findByNumber(budget_number);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':budget_number/property')
    @ApiOperation({ summary: 'ORÇAMENTO VIA PROPRIEDADE' })
    async findByProperty(
        @Param('budget_number') budget_number: string
    ): Promise<any> {
        return this.budgetService.findByProperty(budget_number);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':budget_number')
    @ApiOperation({ summary: 'EDITAR ORÇAMENTO' })
    @ApiBody({ type: BudgetEditDto })
    async update(
        @Param('budget_number') budget_number: string,
        @Body() body: BudgetEditDto
    ): Promise<any> {
        return this.budgetService.update(budget_number, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':budget_number')
    @ApiOperation({ summary: 'DELETA UM ORÇAMENTO' })
    async delete(
        @Param('budget_number') budget_number: string
    ): Promise<void> {
        return this.budgetService.delete(budget_number);
    }

}

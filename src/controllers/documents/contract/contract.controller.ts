/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ContractService } from './contract.service';
import { ContractDto, ContractEditDto, FilterContractDto } from './contract.dto';
@ApiTags('DOCUMENTO - CONTRATO')
@ApiBearerAuth()
@Controller('contract')
export class ContractController {
    constructor(private readonly contractService: ContractService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'REGISTRAR DADOS DE UM CONTRATO' })
    @ApiBody({ type: ContractDto })
    async create(
        @Body() body: ContractDto,
    ): Promise<any> {
        return this.contractService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('filter/:property')
    @ApiOperation({ summary: 'FILTRO PARA CONTRATOS' })
    @ApiBody({ type: FilterContractDto })
    async findFiltered(
        @Param('property') property: string,
        @Body() body: FilterContractDto,
    ): Promise<any[]> {
        return this.contractService.findFiltered(body, property);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODOS CONTRATOS REGISTRADOS' })
    async findAll(): Promise<any> {
        return this.contractService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/number')
    @ApiOperation({ summary: 'CONTRATO VIA ID' })
    async findByNumber(
        @Param('id') id: string
    ): Promise<any> {
        return this.contractService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/property')
    @ApiOperation({ summary: 'CONTRATO VIA PROPRIEDADE' })
    async findByProperty(
        @Param('id') id: string
    ): Promise<any> {
        return this.contractService.findByProperty(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiOperation({ summary: 'EDITAR CONTRATO' })
    @ApiBody({ type: ContractEditDto })
    async update(
        @Param('id') id: string,
        @Body() body: ContractEditDto
    ): Promise<any> {
        return this.contractService.update(id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'DELETA UM CONTRATO' })
    async delete(
        @Param('id') id: string
    ): Promise<void> {
        return this.contractService.delete(id);
    }

}

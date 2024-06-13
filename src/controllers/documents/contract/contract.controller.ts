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

    @Get('pdf/:contract_number')
    async downloadPDF(
        @Param('contract_number') contract_number: string
    ): Promise<void> {
        await this.contractService.generatePdf(contract_number);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':contract_number/number')
    @ApiOperation({ summary: 'CONTRATO VIA NUMERO DE CONTRATO' })
    async findByNumber(
        @Param('contract_number') contract_number: string
    ): Promise<any> {
        return this.contractService.findByNumber(contract_number);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':contract_number/property')
    @ApiOperation({ summary: 'CONTRATO VIA PROPRIEDADE' })
    async findByProperty(
        @Param('contract_number') contract_number: string
    ): Promise<any> {
        return this.contractService.findByProperty(contract_number);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':contract_number')
    @ApiOperation({ summary: 'EDITAR CONTRATO' })
    @ApiBody({ type: ContractEditDto })
    async update(
        @Param('contract_number') contract_number: string,
        @Body() body: ContractEditDto
    ): Promise<any> {
        return this.contractService.update(contract_number, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':contract_number')
    @ApiOperation({ summary: 'DELETA UM CONTRATO' })
    async delete(
        @Param('contract_number') contract_number: string
    ): Promise<void> {
        return this.contractService.delete(contract_number);
    }

}

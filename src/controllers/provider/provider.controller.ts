/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProviderService } from './provider.service';
import { FilterProviderDto, ProviderDto, ProviderEditDto } from './provider.dto';
import { Provider } from './provider.entity';
@ApiTags('CLIENTES/FORNECEDORES')
@ApiBearerAuth()
@Controller('provider')
export class ProviderController {

    constructor(private readonly providerService: ProviderService) { }

    @UseGuards(JwtAuthGuard)
    @Post('customer/:property_id')
    @ApiOperation({ summary: 'CRIAR CLIENTE' })
    @ApiBody({ type: ProviderDto })
    async createPartner(
        @Param('property_id') property_id: string,
        @Body() body: Provider,
    ): Promise<Provider> {
        return this.providerService.createCustomer(body, property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('supplier/:property_id')
    @ApiOperation({ summary: 'CRIAR FORNECEDOR' })
    @ApiBody({ type: ProviderDto })
    async createProvider(
        @Param('property_id') property_id: string,
        @Body() body: Provider,
    ): Promise<Provider> {
        return this.providerService.createProvider(body, property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('filter/:property_id')
    @ApiOperation({ summary: 'FILTRO CLIENTE/FORNECEDOR' })
    @ApiBody({ type: FilterProviderDto })
    async findFiltered(
        @Param('property_id') property_id: string,
        @Body() body: FilterProviderDto,
    ): Promise<Provider[]> {
        return await this.providerService.findFiltered(body, property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':property_id')
    @ApiOperation({ summary: 'TODOS CLIENTE/FORNECEDOR' })
    async findAll(@Param('property_id') property_id: string): Promise<Provider[]> {
        return this.providerService.findAll(property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('customer/:property_id')
    @ApiOperation({ summary: 'TODOS CLIENTES' })
    async getPartners(@Param('property_id') property_id: string): Promise<any[]> {
        return this.providerService.getPartners(property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('supplier/:property_id')
    @ApiOperation({ summary: 'TODOS FORNECEDORES' })
    async getProviders(@Param('property_id') property_id: string): Promise<any[]> {
        return this.providerService.getProviders(property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('name/customer/:property_id')
    @ApiOperation({ summary: 'TODOS OS NOMES DOS CLIENTES DE DETERMINADA PROPRIEDADE' })
    async findAllNamesCustomerByProperty(
        @Param('property_id') property_id: string
    ): Promise<any[]> {
        return this.providerService.findAllNamesCustomerByProperty(property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('name/supplier/:property_id')
    @ApiOperation({ summary: 'TODOS OS NOMES DOS FORNECEDORES DE DETERMINADA PROPRIEDADE' })
    async findAllNamesProvidersByProperty(
        @Param('property_id') property_id: string
    ): Promise<any[]> {
        return this.providerService.findAllNamesProvidersByProperty(property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':provider_id')
    @ApiOperation({ summary: 'EDITAR CLIENTE/FORNECEDOR' })
    @ApiBody({ type: ProviderEditDto })
    async update(
        @Param('provider_id') provider_id: string,
        @Body() body: ProviderEditDto
    ): Promise<Provider> {
        return this.providerService.update(provider_id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':provider_id')
    @ApiOperation({ summary: 'DELETAR CLIENTE/FORNECEDOR' })
    async removeProcedure(@Param('provider_id') provider_id: string): Promise<void> {
        return this.providerService.delete(provider_id);
    }

}
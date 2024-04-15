/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProviderService } from './provider.service';
import { FilterProviderDto, ProviderDto, ProviderEditDto } from './provider.dto';
import { Provider } from './provider.entity';
@ApiTags('PARCEIROS/FORNECEDORES')
@ApiBearerAuth()
@Controller('provider')
export class ProviderController {

    constructor(private readonly providerService: ProviderService) { }

    @UseGuards(JwtAuthGuard)
    @Post('partner/:property_id')
    @ApiOperation({ summary: 'CRIAR PARCEIRO' })
    @ApiBody({ type: ProviderDto })
    async createPartner(
        @Param('property_id') property_id: string,
        @Body() body: Provider,
    ): Promise<Provider> {
        return this.providerService.createPartner(body, property_id);
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
    @ApiOperation({ summary: 'FILTRO PARCEIRO/FORNECEDOR' })
    @ApiBody({ type: FilterProviderDto })
    async findFiltered(
        @Param('property_id') property_id: string,
        @Body() body: FilterProviderDto,
    ): Promise<Provider[]> {
        const filtered = await this.providerService.findFiltered(body);
        return this.providerService.filterByProperty(filtered, property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':property_id')
    @ApiOperation({ summary: 'TODOS PARCEIRO/FORNECEDOR' })
    async findAll(@Param('property_id') property_id: string): Promise<Provider[]> {
        return this.providerService.findAll(property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('partner/:property_id')
    @ApiOperation({ summary: 'TODOS PARCEIROS' })
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
    @Put(':provider_id')
    @ApiOperation({ summary: 'EDITAR PARCEIRO/FORNECEDOR' })
    @ApiBody({ type: ProviderEditDto })
    async update(
        @Param('provider_id') provider_id: string,
        @Body() body: ProviderEditDto
    ): Promise<Provider> {
        return this.providerService.update(provider_id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':provider_id')
    @ApiOperation({ summary: 'DELETAR PARCEIRO/FORNECEDOR' })
    async removeProcedure(@Param('provider_id') provider_id: string): Promise<void> {
        return this.providerService.delete(provider_id);
    }

}
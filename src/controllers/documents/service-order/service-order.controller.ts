/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderDto, ServiceOrderEditDto } from './service-order.dto';
@ApiTags('DOCUMENTO - ORDEM DE SERVIÇO')
@ApiBearerAuth()
@Controller('service-order')
export class ServiceOrderController {
    constructor(private readonly orderService: ServiceOrderService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'REGISTRAR DADOS DE UM ORDEM DE SERVIÇO' })
    @ApiBody({ type: ServiceOrderDto })
    async create(
        @Body() body: ServiceOrderDto,
    ): Promise<any> {
        return this.orderService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODOS ORDEM DE SERVIÇOS REGISTRADOS' })
    async findAll(): Promise<any> {
        return this.orderService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':order_number/number')
    @ApiOperation({ summary: 'ORDEM DE SERVIÇO VIA NUMERO DE ORDEM DE SERVIÇO' })
    async findByNumber(
        @Param('order_number') order_number: string
    ): Promise<any> {
        return this.orderService.findByNumber(order_number);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':order_number/property')
    @ApiOperation({ summary: 'ORDEM DE SERVIÇO VIA PROPRIEDADE' })
    async findByProperty(
        @Param('order_number') order_number: string
    ): Promise<any> {
        return this.orderService.findByProperty(order_number);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':order_number')
    @ApiOperation({ summary: 'EDITAR ORDEM DE SERVIÇO' })
    @ApiBody({ type: ServiceOrderEditDto })
    async update(
        @Param('order_number') order_number: string,
        @Body() body: ServiceOrderEditDto
    ): Promise<any> {
        return this.orderService.update(order_number, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':order_number')
    @ApiOperation({ summary: 'DELETA UM ORDEM DE SERVIÇO' })
    async delete(
        @Param('order_number') order_number: string
    ): Promise<void> {
        return this.orderService.delete(order_number);
    }

}

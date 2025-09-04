/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BankSlipService } from './bank-slip.service';
import { BankSlipDto, BankSlipEditDto } from './bank-slip.dto';
import { FilterDocumentsDto } from '../documents.dto';
@ApiTags('DOCUMENTO - BOLETO')
@ApiBearerAuth()
@Controller('bank-slip')
export class BankSlipController {
  constructor(private readonly ticketService: BankSlipService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'REGISTRAR DADOS DE UM BOLETO' })
  @ApiBody({ type: BankSlipDto })
  async create(@Body() body: BankSlipDto): Promise<any> {
    return this.ticketService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('filter/:property')
  @ApiOperation({ summary: 'FILTRO PARA BOLETOS' })
  @ApiBody({ type: FilterDocumentsDto })
  async findFiltered(
    @Param('property') property: string,
    @Body() body: FilterDocumentsDto,
  ): Promise<any[]> {
    if (body.initialDate) {
      const start = new Date(body.initialDate);
      start.setUTCHours(0, 0, 0, 0);
      body.initialDate = start;
    }

    if (body.lastDate) {
      const end = new Date(body.lastDate);
      end.setUTCHours(23, 59, 59, 999);
      body.lastDate = end;
    }

    return this.ticketService.findFiltered(body, property);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS BOLETOS REGISTRADOS' })
  async findAll(): Promise<any> {
    return this.ticketService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':ticket_number/number')
  @ApiOperation({ summary: 'BOLETO VIA NUMERO DE BOLETO' })
  async findByNumber(
    @Param('ticket_number') ticket_number: string,
  ): Promise<any> {
    return this.ticketService.findByNumber(ticket_number);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':ticket_number/property')
  @ApiOperation({ summary: 'BOLETO VIA PROPRIEDADE' })
  async findByProperty(
    @Param('ticket_number') ticket_number: string,
  ): Promise<any> {
    return this.ticketService.findByProperty(ticket_number);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':ticket_number')
  @ApiOperation({ summary: 'EDITAR BOLETO' })
  @ApiBody({ type: BankSlipEditDto })
  async update(
    @Param('ticket_number') ticket_number: string,
    @Body() body: BankSlipEditDto,
  ): Promise<any> {
    return this.ticketService.update(ticket_number, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':ticket_number')
  @ApiOperation({ summary: 'DELETA UM BOLETO' })
  async delete(@Param('ticket_number') ticket_number: string): Promise<void> {
    return this.ticketService.delete(ticket_number);
  }
}

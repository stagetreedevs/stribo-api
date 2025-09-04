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
import { ReceiptService } from './receipt.service';
import { ReceiptDto, ReceiptEditDto } from './receipt.dto';
import { FilterDocumentsDto } from '../documents.dto';
@ApiTags('DOCUMENTO - RECIBOS')
@ApiBearerAuth()
@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'REGISTRAR DADOS DE UM RECIBO' })
  @ApiBody({ type: ReceiptDto })
  async create(@Body() body: ReceiptDto): Promise<any> {
    return this.receiptService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('filter/:property')
  @ApiOperation({ summary: 'FILTRO PARA RECIBO' })
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

    return this.receiptService.findFiltered(body, property);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS RECIBOS REGISTRADOS' })
  async findAll(): Promise<any> {
    return this.receiptService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':receipt_number/number')
  @ApiOperation({ summary: 'RECIBO VIA NUMERO DE RECIBO' })
  async findByNumber(
    @Param('receipt_number') receipt_number: string,
  ): Promise<any> {
    return this.receiptService.findByNumber(receipt_number);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':receipt_number/property')
  @ApiOperation({ summary: 'RECIBO VIA PROPRIEDADE' })
  async findByProperty(
    @Param('receipt_number') receipt_number: string,
  ): Promise<any> {
    return this.receiptService.findByProperty(receipt_number);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':receipt_number')
  @ApiOperation({ summary: 'EDITAR RECIBO' })
  @ApiBody({ type: ReceiptEditDto })
  async update(
    @Param('receipt_number') receipt_number: string,
    @Body() body: ReceiptEditDto,
  ): Promise<any> {
    return this.receiptService.update(receipt_number, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':receipt_number')
  @ApiOperation({ summary: 'DELETA UM RECIBO' })
  async delete(@Param('receipt_number') receipt_number: string): Promise<void> {
    return this.receiptService.delete(receipt_number);
  }
}

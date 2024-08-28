import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SemenReceiptService } from './semen-receipt.service';
import {
  FilterSemenReceiptDto,
  SemenReceiptDto,
  UpdateCommercialStatusDto,
  UpdateStatusDto,
} from './semen-receipt.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('SEMEM RECEIPT')
@ApiBearerAuth()
@Controller('semen-receipt')
export class SemenReceiptController {
  constructor(private readonly semenReceiptService: SemenReceiptService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR RECEBIMENTO DE SÊMEN' })
  @ApiBody({ type: SemenReceiptDto })
  async create(@Body() body: SemenReceiptDto): Promise<any> {
    return this.semenReceiptService.create(body);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS RECEBIMENTO DE SÊMEN' })
  async findAll(@Query() query: FilterSemenReceiptDto): Promise<any> {
    return this.semenReceiptService.findAll(query);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('detail/:id')
  @ApiOperation({ summary: 'DETALHES RECEBIMENTO DE SÊMEN' })
  async findById(@Param('id') id: string): Promise<any> {
    return this.semenReceiptService.findById(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id/commercial-status/:status')
  @ApiOperation({ summary: 'ALTERAR STATUS COMERCIAL' })
  async updateCommercialStatus(
    @Param() params: UpdateCommercialStatusDto,
  ): Promise<any> {
    return this.semenReceiptService.updateCommercialStatus(
      params.id,
      params.status,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'ALTERAR STATUS' })
  async updateStatus(@Param() params: UpdateStatusDto): Promise<any> {
    return this.semenReceiptService.updateStatus(params.id, params.status);
  }

  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'ATUALIZAR RECEBIMENTO DE SÊMEN' })
  async update(
    @Param('id') id: string,
    @Body() body: SemenReceiptDto,
  ): Promise<any> {
    return this.semenReceiptService.update(id, body);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'DELETAR RECEBIMENTO DE SÊMEN' })
  async delete(@Param('id') id: string): Promise<any> {
    return this.semenReceiptService.delete(id);
  }
}

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
import { SemenShippingService } from './semen-shipping.service';
import {
  FilterSemenShippingDto,
  SemenShippingDto,
  UpdateCommercialStatusDto,
  UpdateStatusDto,
} from './semen-shipping.dto';
import { SemenShipping } from './semen-shipping.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('SEMEM ENVIADOS')
@ApiBearerAuth()
@Controller('semen-shipping')
export class SemenShippingController {
  constructor(private readonly semenService: SemenShippingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR ENVIO DE SÊMEN' })
  @ApiBody({ type: SemenShippingDto })
  async create(@Body() body: SemenShippingDto): Promise<SemenShipping> {
    return this.semenService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS ENVIO DE SÊMEN' })
  async findAll(@Query() query: FilterSemenShippingDto): Promise<any> {
    query.start_date = query.start_date ? new Date(query.start_date) : null;
    query.end_date = query.end_date ? new Date(query.end_date) : null;

    return this.semenService.findAll(query);
  }

  @Get('property/:property_id')
  @ApiOperation({ summary: 'TODOS ENVIO DE SÊMEN POR PROPRIEDADE' })
  async findByProperty(
    @Query() query: FilterSemenShippingDto,
    @Param('property_id') property: string,
  ): Promise<any> {
    query.start_date = query.start_date ? new Date(query.start_date) : null;
    query.end_date = query.end_date ? new Date(query.end_date) : null;

    return this.semenService.findAll(query, property);
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail/:id')
  @ApiOperation({ summary: 'DETALHES ENVIO DE SÊMEN' })
  async findById(@Param('id') id: string): Promise<SemenShipping> {
    return this.semenService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/commercial-status/:status')
  @ApiOperation({ summary: 'ALTERAR STATUS COMERCIAL' })
  async updateCommercialStatus(
    @Param() params: UpdateCommercialStatusDto,
  ): Promise<SemenShipping> {
    return this.semenService.updateCommercialStatus(params.id, params.status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'ALTERAR STATUS' })
  async updateStatus(@Param() params: UpdateStatusDto): Promise<SemenShipping> {
    return this.semenService.updateStatus(params.id, params.status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'ATUALIZAR ENVIO DE SÊMEN' })
  @ApiBody({ type: SemenShippingDto })
  async update(
    @Param('id') id: string,
    @Body() body: SemenShippingDto,
  ): Promise<SemenShipping> {
    return this.semenService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'DELETAR ENVIO DE SÊMEN' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.semenService.delete(id);
  }
}

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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SemenService } from './semen.service';
import { FilterSemenShippingDto, SemenShippingDto } from './dto/shipping.dto';
import { SemenShipping } from './entity/shipping.entity';

@ApiTags('SEMEM')
@ApiBearerAuth()
@Controller('semen')
export class SemenController {
  constructor(private readonly semenService: SemenService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('shipping')
  @ApiOperation({ summary: 'CRIAR ENVIO DE SÊMEN' })
  @ApiBody({ type: SemenShippingDto })
  async create(@Body() body: SemenShipping): Promise<SemenShipping> {
    return this.semenService.create(body);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('shipping')
  @ApiOperation({ summary: 'TODOS ENVIO DE SÊMEN' })
  async findAll(@Query() query: FilterSemenShippingDto): Promise<any> {
    return this.semenService.findAll(query);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('shipping/detail/:id')
  @ApiOperation({ summary: 'DETALHES ENVIO DE SÊMEN' })
  async findById(@Query('id') id: string): Promise<SemenShipping> {
    return this.semenService.findById(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('shipping/:id/commercial-status/:status')
  @ApiOperation({ summary: 'ALTERAR STATUS COMERCIAL' })
  async updateCommercialStatus(
    @Param('id') id: string,
    @Param('status') status: string,
  ): Promise<SemenShipping> {
    return this.semenService.updateCommercialStatus(id, status);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('shipping/:id/status/:status')
  @ApiOperation({ summary: 'ALTERAR STATUS' })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: string,
  ): Promise<SemenShipping> {
    return this.semenService.updateStatus(id, status);
  }

  // @UseGuards(JwtAuthGuard)
  @Put('shipping/:id')
  @ApiOperation({ summary: 'ATUALIZAR ENVIO DE SÊMEN' })
  @ApiBody({ type: SemenShippingDto })
  async update(
    @Param('id') id: string,
    @Body() body: SemenShipping,
  ): Promise<SemenShipping> {
    return this.semenService.update(id, body);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('shipping/:id')
  @ApiOperation({ summary: 'DELETAR ENVIO DE SÊMEN' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.semenService.delete(id);
  }
}

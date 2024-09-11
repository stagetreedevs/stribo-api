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
import { SemenFrozenService } from './semen-frozen.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  FilterSemenFrozen,
  SemenFrozenDto,
  UpdateStatusDto,
} from './semen-frozen.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SemenFrozen } from './semen-frozen.entity';

@ApiTags('SEMEM CONGELADO')
@ApiBearerAuth()
@Controller('semen-frozen')
export class SemenFrozenController {
  constructor(private readonly semenFrozenService: SemenFrozenService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR SÊMEN CONGELADO' })
  @ApiBody({ type: SemenFrozenDto })
  async create(@Body() body: SemenFrozenDto): Promise<any> {
    return this.semenFrozenService.create(body);
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS SÊMEN CONGELADO' })
  async findAll(@Query() query: FilterSemenFrozen): Promise<any> {
    query.start_date = query.start_date ? new Date(query.start_date) : null;
    query.end_date = query.end_date ? new Date(query.end_date) : null;

    return this.semenFrozenService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('property/:property_id')
  @ApiOperation({ summary: 'TODOS SÊMEN CONGELADO POR PROPRIEDADE' })
  async findByProperty(
    @Query() query: FilterSemenFrozen,
    @Param('property_id') property: string,
  ): Promise<any> {
    query.start_date = query.start_date ? new Date(query.start_date) : null;
    query.end_date = query.end_date ? new Date(query.end_date) : null;

    return this.semenFrozenService.findAll(query, property);
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail/:id')
  @ApiOperation({ summary: 'DETALHES SÊMEN CONGELADO' })
  async findById(@Param('id') id: string): Promise<any> {
    return this.semenFrozenService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stock')
  @ApiOperation({ summary: 'ESTOQUE SÊMEN CONGELADO' })
  async stock(): Promise<any> {
    return this.semenFrozenService.getStock();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stock/:property_id')
  @ApiOperation({ summary: 'ESTOQUE SÊMEN CONGELADO POR PROPRIEDADE' })
  async stockByProperty(@Param('property_id') property: string): Promise<any> {
    return this.semenFrozenService.getStock(property);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'ATUALIZAR SÊMEN CONGELADO' })
  @ApiBody({ type: SemenFrozenDto })
  async update(
    @Param('id') id: string,
    @Body() body: SemenFrozenDto,
  ): Promise<any> {
    return this.semenFrozenService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'ALTERAR STATUS' })
  async updateStatus(@Param() params: UpdateStatusDto): Promise<SemenFrozen> {
    return this.semenFrozenService.updateStatus(params.id, params.status);
  }

  //@UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'DELETAR SÊMEN CONGELADO' })
  async delete(@Param('id') id: string): Promise<any> {
    return this.semenFrozenService.delete(id);
  }
}

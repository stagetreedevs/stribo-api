import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SemenFrozenService } from './semen-frozen.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { FilterSemenFrozen, SemenFrozenDto } from './semen-frozen.dto';

@Controller('semen-frozen')
export class SemenFrozenController {
  constructor(private readonly semenFrozenService: SemenFrozenService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR SÊMEN CONGELADO' })
  @ApiBody({ type: SemenFrozenDto })
  async create(@Body() body: SemenFrozenDto): Promise<any> {
    return this.semenFrozenService.create(body);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS SÊMEN CONGELADO' })
  async findAll(@Query() query: FilterSemenFrozen): Promise<any> {
    return this.semenFrozenService.findAll(query);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('detail/:id')
  @ApiOperation({ summary: 'DETALHES SÊMEN CONGELADO' })
  async findById(@Param('id') id: string): Promise<any> {
    return this.semenFrozenService.findById(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('stock')
  @ApiOperation({ summary: 'ESTOQUE SÊMEN CONGELADO' })
  async stock(): Promise<any> {
    return this.semenFrozenService.getStock();
  }

  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'ATUALIZAR SÊMEN CONGELADO' })
  @ApiBody({ type: SemenFrozenDto })
  async update(
    @Param('id') id: string,
    @Body() body: SemenFrozenDto,
  ): Promise<any> {
    return this.semenFrozenService.update(id, body);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'DELETAR SÊMEN CONGELADO' })
  async delete(@Param('id') id: string): Promise<any> {
    return this.semenFrozenService.delete(id);
  }
}

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
import {
  AnimalReproductives,
  ReproductiveInfo,
  ReproductiveService,
  Status,
} from './reproductive.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  FilterReproductiveDto,
  ReproductiveDto,
  SearchByDateDto,
  UpdateReproductiveDto,
} from './reproductive.dto';
import { Reproductive } from './reproductive.entity';

@ApiTags('REPRODUTIVO')
@ApiBearerAuth()
@Controller('reproductive')
export class ReproductiveController {
  constructor(private readonly reproductiveService: ReproductiveService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR REPRODUTIVO' })
  @ApiBody({ type: ReproductiveDto })
  async create(@Body() body: Reproductive): Promise<Reproductive> {
    return this.reproductiveService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS REPRODUTIVOS' })
  async findAll(): Promise<ReproductiveInfo[]> {
    return this.reproductiveService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('property/:property_id')
  @ApiOperation({ summary: 'TODOS REPRODUTIVOS POR PROPRIEDADE' })
  async findByProperty(
    @Param('property_id') property,
  ): Promise<ReproductiveInfo[]> {
    return this.reproductiveService.findAll(property);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter')
  @ApiOperation({ summary: 'FILTRAR REPRODUTIVOS' })
  async filter(
    @Query() query: FilterReproductiveDto,
  ): Promise<ReproductiveInfo[]> {
    return this.reproductiveService.filter(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/property/:property_id')
  @ApiOperation({ summary: 'FILTRAR REPRODUTIVOS POR PROPRIEDADE' })
  async filterByProperty(
    @Param('property_id') property,
  ): Promise<ReproductiveInfo[]> {
    return this.reproductiveService.filter(property);
  }

  @UseGuards(JwtAuthGuard)
  @Get('past')
  @ApiOperation({ summary: 'REPRODUTIVOS PASSADOS' })
  async findPast(): Promise<ReproductiveInfo[]> {
    return this.reproductiveService.findPast();
  }

  @UseGuards(JwtAuthGuard)
  @Get('past/property/:property_id')
  @ApiOperation({ summary: 'REPRODUTIVOS PASSADOS POR PROPRIEDADE' })
  async findPastByProperty(
    @Param('property_id') property,
  ): Promise<ReproductiveInfo[]> {
    return this.reproductiveService.findPast(property);
  }

  @UseGuards(JwtAuthGuard)
  @Get('future')
  @ApiOperation({ summary: 'REPRODUTIVOS FUTUROS' })
  async findFuture(): Promise<ReproductiveInfo[]> {
    return this.reproductiveService.findFuture();
  }

  @UseGuards(JwtAuthGuard)
  @Get('future/property/:property_id')
  @ApiOperation({ summary: 'REPRODUTIVOS FUTUROS POR PROPRIEDADE' })
  async findFutureByProperty(
    @Param('property_id') property,
  ): Promise<ReproductiveInfo[]> {
    return this.reproductiveService.findFuture(property);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search-date/:date')
  @ApiOperation({ summary: 'BUSCAR POR DATA' })
  async searchByDate(
    @Param('date') date: Date,
    @Query() query: SearchByDateDto,
  ): Promise<AnimalReproductives[] | ReproductiveInfo[]> {
    return this.reproductiveService.findByDate(new Date(date), query.layout);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search-date/:date/property/:property_id')
  @ApiOperation({ summary: 'BUSCAR POR DATA E PROPRIEDADE' })
  async searchByDateAndProperty(
    @Param('date') date: Date,
    @Param('property_id') property,
  ): Promise<AnimalReproductives[] | ReproductiveInfo[]> {
    return this.reproductiveService.findByDate(new Date(date), property);
  }

  @UseGuards(JwtAuthGuard)
  @Get('details/:id')
  @ApiOperation({ summary: 'REPRODUTIVO POR ID' })
  async findById(@Param('id') id: string): Promise<Reproductive> {
    return this.reproductiveService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'ATUALIZAR REPRODUTIVO' })
  @ApiBody({ type: UpdateReproductiveDto })
  async update(
    @Param('id') id: string,
    @Body() body: Reproductive,
  ): Promise<Reproductive> {
    return this.reproductiveService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @ApiOperation({ summary: 'ATUALIZAR STATUS REPRODUTIVO' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
  ): Promise<Reproductive> {
    return this.reproductiveService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'DELETAR REPRODUTIVO' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.reproductiveService.delete(id);
  }
}

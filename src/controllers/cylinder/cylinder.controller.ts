import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CylinderService } from './cylinder.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CylinderDto } from './cylinder.dto';

@ApiTags('BOTIJÃO')
@ApiBearerAuth()
@Controller('cylinder')
export class CylinderController {
  constructor(private readonly cylinderService: CylinderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR BOTIJÃO' })
  @ApiBody({ type: CylinderDto })
  async create(@Body() body: CylinderDto): Promise<any> {
    return this.cylinderService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS BOTIJÕES' })
  async findAll(): Promise<any> {
    return this.cylinderService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('names')
  @ApiOperation({ summary: 'NOMES BOTIJÕES' })
  async findAllNames(): Promise<any> {
    return this.cylinderService.findAllNames();
  }

  @UseGuards(JwtAuthGuard)
  @Get('names/:property_id')
  @ApiOperation({ summary: 'NOMES BOTIJÕES POR PROPRIEDADE' })
  async findAllNamesByProperty(
    @Param('property_id') property_id: string,
  ): Promise<any> {
    return this.cylinderService.findAllNamesByProperty(property_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('property/:property_id')
  @ApiOperation({ summary: 'TODOS BOTIJÕES POR PROPRIEDADE' })
  async findByProperty(@Param('property_id') property: string): Promise<any> {
    return this.cylinderService.findAll(property);
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail/:id')
  @ApiOperation({ summary: 'DETALHES BOTIJÃO' })
  async findById(@Param('id') id: string): Promise<any> {
    return this.cylinderService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'ATUALIZAR BOTIJÃO' })
  async update(
    @Param('id') id: string,
    @Body() body: CylinderDto,
  ): Promise<any> {
    return this.cylinderService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'DELETAR BOTIJÃO' })
  async delete(@Param('id') id: string): Promise<any> {
    return this.cylinderService.delete(id);
  }
}

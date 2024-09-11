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
import { CompetitionService } from './competition.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateCompetitionDto,
  FilterCompetitionDto,
  UpdateAwardDto,
  UpdateCompetitionDto,
} from './competition.dto';
import { Competition } from './competition.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('COMPETIÇÃO')
@ApiBearerAuth()
@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR COMPETIÇÃO' })
  async create(@Body() body: CreateCompetitionDto): Promise<Competition> {
    return this.competitionService.create(body);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('filter/:property_id')
  @ApiOperation({ summary: 'FILTRO PARA COMPETIÇÕES' })
  async findFiltered(
    @Param('property_id') property_id: string,
    @Query() filter: FilterCompetitionDto,
  ): Promise<Competition[]> {
    return this.competitionService.filter(property_id, filter);
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODAS COMPETIÇÕES' })
  async findAll(): Promise<Competition[]> {
    return this.competitionService.findAll();
  }

  //@UseGuards(JwtAuthGuard)
  @Get('details/:id')
  @ApiOperation({ summary: 'COMPETIÇÃO POR ID' })
  async findOne(@Param('id') id: string): Promise<Competition> {
    return this.competitionService.findOne(id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('property/:property_id')
  @ApiOperation({ summary: 'COMPETIÇÕES POR PROPRIEDADE' })
  async findByProperty(
    @Param('property_id') property_id: string,
  ): Promise<Competition[]> {
    return this.competitionService.findCompetitions(property_id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('animals/:property_id')
  @ApiOperation({ summary: 'COMPETIÇÕES POR ANIMAL' })
  async findByAnimal(
    @Param('property_id') property_id: string,
  ): Promise<Competition[]> {
    return this.competitionService.findCompetitionByAnimal(property_id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('awarded/:property_id')
  @ApiOperation({ summary: 'COMPETIÇÕES PREMIADAS' })
  async findAwarded(
    @Param('property_id') property_id: string,
  ): Promise<Competition[]> {
    return this.competitionService.findAwardedCompetitions(property_id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('analytics/:property_id')
  @ApiOperation({ summary: 'ANÁLISE DE COMPETIÇÕES' })
  async getAnalytics(@Param('property_id') property_id: string): Promise<any> {
    return this.competitionService.getAnalytics(property_id);
  }

  //@UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'ATUALIZAR COMPETIÇÃO' })
  @ApiBody({ type: UpdateCompetitionDto })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCompetitionDto,
  ): Promise<Competition> {
    return this.competitionService.update(id, body);
  }

  //@UseGuards(JwtAuthGuard)
  @Patch('award/:competition_id')
  @ApiOperation({ summary: 'ATUALIZAR PREMIAÇÃO' })
  async updatePrize(
    @Param('competition_id') competition_id: string,
    @Body() body: UpdateAwardDto,
  ): Promise<Competition> {
    return this.competitionService.updateAwarded(competition_id, body);
  }

  //@UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'DELETAR COMPETIÇÃO' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.competitionService.delete(id);
  }
}

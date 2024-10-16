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
import { ReproductiveService } from './reproductive.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  FilterProcedureDto,
  ProcedureStatusDto,
  ReproductiveDto,
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
  @ApiOperation({ summary: 'CRIAR PROCEDIMENTO CLÍNICO' })
  @ApiBody({ type: ReproductiveDto })
  async create(@Body() body: Reproductive): Promise<Reproductive> {
    return this.reproductiveService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('management-list/:property_id')
  @ApiOperation({ summary: 'LISTA DE GERENCIAMENTO POR PROPRIEDADE' })
  async managementList(
    @Param('property_id') property_id: string,
  ): Promise<any> {
    return this.reproductiveService.getManagementList(property_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('order-date/:property_id')
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS' })
  async findAll(
    @Param('property_id') property_id: string,
    @Query() query: FilterProcedureDto,
  ): Promise<Reproductive[]> {
    return this.reproductiveService.findAll(property_id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('animals/:property_id')
  @ApiOperation({ summary: 'PROCEDIMENTOS CLÍNICOS POR ANIMAL' })
  async findProcedureByAnimal(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.reproductiveService.findProcedureByAnimal(property_id, 'all');
  }

  @UseGuards(JwtAuthGuard)
  @Get('animals/:property_id/today')
  @ApiOperation({ summary: 'PROCEDIMENTOS CLÍNICOS POR ANIMAL' })
  async findProcedureByAnimalToday(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.reproductiveService.findProcedureByAnimal(property_id, 'today');
  }

  @UseGuards(JwtAuthGuard)
  @Get('animals/:property_id/past')
  @ApiOperation({ summary: 'PROCEDIMENTOS CLÍNICOS POR ANIMAL' })
  async findProcedureByAnimalPast(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.reproductiveService.findProcedureByAnimal(property_id, 'past');
  }

  @UseGuards(JwtAuthGuard)
  @Get('animals/:property_id/future')
  @ApiOperation({ summary: 'PROCEDIMENTOS CLÍNICOS POR ANIMAL' })
  async findProcedureByAnimalFuture(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.reproductiveService.findProcedureByAnimal(
      property_id,
      'future',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':animal_id')
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS DE UM ANIMAL' })
  async findByAnimal(
    @Param('animal_id') animal_id: string,
  ): Promise<Reproductive[]> {
    return this.reproductiveService.findAndProcessProcedures(animal_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('details/:procedure_id')
  @ApiOperation({ summary: 'DETALHES DE UM PROCEDIMENTO CLÍNICO' })
  async findOne(
    @Param('procedure_id') procedure_id: string,
  ): Promise<Reproductive> {
    return this.reproductiveService.findOne(procedure_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('names/:property_id')
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS DE UMA PROPRIEDADE' })
  async findAllProcedureNames(
    @Param('property_id') property_id: string,
  ): Promise<string[]> {
    return this.reproductiveService.findAllProcedureNames(property_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('property/:property_id')
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS DA PROPRIEDADE' })
  async findByProperty(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.reproductiveService.findByProperty(property_id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('today/:property_id')
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS DA PROPRIEDADE HOJE' })
  async findTodayProcedure(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.reproductiveService.findTodayProcedure(property_id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('past/:property_id')
  @ApiOperation({
    summary: 'TODOS PROCEDIMENTOS CLÍNICOS DA PROPRIEDADE ANTERIORES',
  })
  async findPastProcedures(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.reproductiveService.findPastProcedures(property_id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('future/:property_id')
  @ApiOperation({
    summary: 'TODOS PROCEDIMENTOS CLÍNICOS DA PROPRIEDADE FUTUROS',
  })
  async findFutureProcedures(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.reproductiveService.findFutureProcedures(property_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':procedure_id/status/:status')
  @ApiOperation({ summary: 'ATUALIZAR STATUS DO PROCEDIMENTO CLÍNICO' })
  @ApiBody({ type: ProcedureStatusDto })
  async updateStatus(
    @Param('procedure_id') procedure_id: string,
    @Param('status') status: string,
  ): Promise<Reproductive> {
    return this.reproductiveService.updateStatus(procedure_id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':procedure_id')
  @ApiOperation({ summary: 'EDITAR PROCEDIMENTO CLÍNICO' })
  @ApiBody({ type: UpdateReproductiveDto })
  async update(
    @Param('procedure_id') procedure_id: string,
    @Body() body: UpdateReproductiveDto,
  ): Promise<Reproductive> {
    return this.reproductiveService.update(procedure_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':procedure_id')
  @ApiOperation({ summary: 'DELETAR PROCEDIMENTO CLÍNICO' })
  async removeProcedure(
    @Param('procedure_id') procedure_id: string,
  ): Promise<void> {
    return this.reproductiveService.removeProcedure(procedure_id);
  }
}

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
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProcedureService } from './procedure.service';
import {
  FilterProcedureDto,
  ProcedureDto,
  ProcedureEditDto,
  ProcedureStatusDto,
} from './procedure.dto';
import { Procedure } from './procedure.entity';
@ApiTags('PROCEDIMENTO CLÍNICO')
@ApiBearerAuth()
@Controller('procedure')
export class ProcedureController {
  constructor(private readonly procedService: ProcedureService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR PROCEDIMENTO CLÍNICO' })
  @ApiBody({ type: ProcedureDto })
  async create(@Body() body: Procedure): Promise<Procedure> {
    return this.procedService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('filter')
  @ApiOperation({ summary: 'FILTRO PARA PROCEDIMENTOS' })
  @ApiBody({ type: FilterProcedureDto })
  async findFiltered(@Body() body: FilterProcedureDto): Promise<Procedure[]> {
    const procedures: Procedure[] = await this.procedService.findFiltered(body);
    return await this.procedService.formattedDate(procedures);
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS' })
  async findAll(): Promise<Procedure[]> {
    return this.procedService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('animals/:property_id')
  @ApiOperation({ summary: 'PROCEDIMENTOS CLÍNICOS POR ANIMAL' })
  async findProcedureByAnimal(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.procedService.findProcedureByAnimal(property_id, 'all');
  }

  @UseGuards(JwtAuthGuard)
  @Get('animals/:property_id/today')
  @ApiOperation({ summary: 'PROCEDIMENTOS CLÍNICOS POR ANIMAL' })
  async findProcedureByAnimalToday(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.procedService.findProcedureByAnimal(property_id, 'today');
  }

  @UseGuards(JwtAuthGuard)
  @Get('animals/:property_id/past')
  @ApiOperation({ summary: 'PROCEDIMENTOS CLÍNICOS POR ANIMAL' })
  async findProcedureByAnimalPast(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.procedService.findProcedureByAnimal(property_id, 'past');
  }

  @UseGuards(JwtAuthGuard)
  @Get('animals/:property_id/future')
  @ApiOperation({ summary: 'PROCEDIMENTOS CLÍNICOS POR ANIMAL' })
  async findProcedureByAnimalFuture(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.procedService.findProcedureByAnimal(property_id, 'future');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':animal_id')
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS DE UM ANIMAL' })
  async findByAnimal(
    @Param('animal_id') animal_id: string,
  ): Promise<Procedure[]> {
    return this.procedService.findAndProcessProcedures(animal_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('details/:procedure_id')
  @ApiOperation({ summary: 'DETALHES DE UM PROCEDIMENTO CLÍNICO' })
  async findOne(
    @Param('procedure_id') procedure_id: string,
  ): Promise<Procedure> {
    return this.procedService.findOne(procedure_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('names/:property_id')
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS DE UMA PROPRIEDADE' })
  async findAllProcedureNames(
    @Param('property_id') property_id: string,
  ): Promise<string[]> {
    return this.procedService.findAllProcedureNames(property_id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('property/:property_id')
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS DA PROPRIEDADE' })
  async findByProperty(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.procedService.findByProperty(property_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('today/:property_id')
  @ApiOperation({ summary: 'TODOS PROCEDIMENTOS CLÍNICOS DA PROPRIEDADE HOJE' })
  async findTodayProcedure(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.procedService.findTodayProcedure(property_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('past/:property_id')
  @ApiOperation({
    summary: 'TODOS PROCEDIMENTOS CLÍNICOS DA PROPRIEDADE ANTERIORES',
  })
  async findPastProcedures(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.procedService.findPastProcedures(property_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('future/:property_id')
  @ApiOperation({
    summary: 'TODOS PROCEDIMENTOS CLÍNICOS DA PROPRIEDADE FUTUROS',
  })
  async findFutureProcedures(
    @Param('property_id') property_id: string,
  ): Promise<any[]> {
    return this.procedService.findFutureProcedures(property_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':procedure_id')
  @ApiOperation({ summary: 'ATUALIZAR STATUS DO PROCEDIMENTO CLÍNICO' })
  @ApiBody({ type: ProcedureStatusDto })
  async updateStatus(
    @Param('procedure_id') procedure_id: string,
    @Body() body: ProcedureStatusDto,
  ): Promise<Procedure> {
    const { status } = body;
    return this.procedService.updateStatus(procedure_id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':procedure_id')
  @ApiOperation({ summary: 'EDITAR PROCEDIMENTO CLÍNICO' })
  @ApiBody({ type: ProcedureEditDto })
  async update(
    @Param('procedure_id') procedure_id: string,
    @Body() body: ProcedureEditDto,
  ): Promise<Procedure> {
    return this.procedService.update(procedure_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':procedure_id')
  @ApiOperation({ summary: 'DELETAR PROCEDIMENTO CLÍNICO' })
  async removeProcedure(
    @Param('procedure_id') procedure_id: string,
  ): Promise<void> {
    return this.procedService.removeProcedure(procedure_id);
  }
}

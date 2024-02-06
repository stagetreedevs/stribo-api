/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BiometryService } from './biometry.service';
import { BiometryDto } from './biometry.dto';
import { Biometry } from './biometry.entity';
@ApiTags('BIOMETRIA')
@ApiBearerAuth()
@Controller('biometry')
export class BiometryController {
    constructor(private readonly bioService: BiometryService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'REGISTRAR ANÁLISE BIOMÉTRICA DE UM ANIMAL' })
    @ApiBody({ type: BiometryDto })
    async create(
        @Body() body: Biometry,
    ): Promise<Biometry> {
        return this.bioService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':animal_id')
    @ApiOperation({ summary: 'ANÁLISE BIOMÉTRICA DE UM ANIMAL' })
    async findByAnimal(@Param('animal_id') animal_id: string): Promise<any> {
        return this.bioService.findByAnimal(animal_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('height/:animal_id')
    @ApiOperation({ summary: 'ALTURAS DOS ANIMAIS' })
    async findHeights(@Param('animal_id') animal_id: string): Promise<any> {
        return this.bioService.findHeights(animal_id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':animal_id')
    @ApiOperation({ summary: 'DELETAR TODOS REGISTROS BIOMÉTRICOS DE UM ANIMAL' })
    async delete(@Param('animal_id') animal_id: string): Promise<void> {
        return this.bioService.delete(animal_id);
    }

}

/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeathService } from './death.service';
import { DeathDto } from './death.dto';
import { Death } from './death.entity';
@ApiTags('MORTES')
@ApiBearerAuth()
@Controller('death')
export class DeathController {
    constructor(private readonly deathService: DeathService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'REGISTRA A MORTE DE UM ANIMAL' })
    @ApiBody({ type: DeathDto })
    async create(
        @Body() body: Death,
    ): Promise<Death> {
        return this.deathService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODAS AS MORTES REGISTRADAS' })
    async findAll(): Promise<Death[]> {
        return this.deathService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':animal_id')
    @ApiOperation({ summary: 'DETALHES DA MORTE DE UM ANIMAL' })
    async findByAnimal(@Param('animal_id') animal_id: string): Promise<Death> {
        return this.deathService.findByAnimal(animal_id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':animal_id')
    @ApiOperation({ summary: 'EDITAR DETALHES DA MORTE' })
    @ApiBody({ type: DeathDto })
    async update(@Param('animal_id') animal_id: string, @Body() body: Death): Promise<Death> {
        return this.deathService.update(animal_id, body);
    }

    // @UseGuards(JwtAuthGuard)
    @Delete(':animal_id')
    @ApiOperation({ summary: 'REVIVE UM ANIMAL' })
    async removeManagement(@Param('animal_id') animal_id: string): Promise<void> {
        return this.deathService.revive(animal_id);
    }
}

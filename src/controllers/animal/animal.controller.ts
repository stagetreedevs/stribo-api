/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnimalService } from './animal.service';
import { AnimalDto, FilterAnimalDto, UpdateAnimalDto } from './animal.dto';
import { Animal } from './animal.entity';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('ANIMAL')
@Controller('animal')
export class AnimalController {
    constructor(private readonly animalService: AnimalService) { }

    @Post()
    @ApiOperation({ summary: 'CRIAR ANIMAL' })
    @ApiBody({ type: AnimalDto })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('photo'))
    async create(
        @UploadedFile() photo: Express.Multer.File,
        @Body() body: Animal,
    ): Promise<Animal> {
        body.birthDate = new Date(body.birthDate);
        if (body.castrationDate) {
            body.castrationDate = new Date(body.castrationDate);
        } else {
            body.castrationDate = null;
        }
        return this.animalService.create(body, photo);
    }

    @Post('filter')
    @ApiOperation({ summary: 'FILTRO PARA ANIMAIS' })
    @ApiBody({ type: FilterAnimalDto })
    async findFiltered(
        @Body() body: FilterAnimalDto,
    ): Promise<Animal[]> {
        return this.animalService.findFiltered(body);
    }

    @Get()
    @ApiOperation({ summary: 'TODOS ANIMAIS' })
    async findAll(): Promise<Animal[]> {
        return this.animalService.findAll();
    }

    @Get('names')
    @ApiOperation({ summary: 'TODAS OS NOMES' })
    async findAllNames(): Promise<string[]> {
        return this.animalService.findAllNames();
    }

    @Get('breeds')
    @ApiOperation({ summary: 'TODAS AS RAÇAS' })
    async findAllBreeds(): Promise<string[]> {
        return this.animalService.findAllBreeds();
    }
    @Get('coats')
    @ApiOperation({ summary: 'TODAS AS PELAGENS' })
    async findAllCoats(): Promise<string[]> {
        return this.animalService.findAllCoats();
    }
    @Get('sexes')
    @ApiOperation({ summary: 'TODAS OS SEXOS' })
    async findAllSexes(): Promise<string[]> {
        return this.animalService.findAllSexes();
    }
    @Get('functions')
    @ApiOperation({ summary: 'TODAS AS FUNÇÕES' })
    async findAllOccupations(): Promise<string[]> {
        return this.animalService.findAllOccupations();
    }

    @Get(':id')
    @ApiOperation({ summary: 'BUSCAR ANIMAL' })
    async findOne(@Param('id') id: string): Promise<Animal> {
        return this.animalService.findOne(id);
    }

    @Get(':ownerId/owner')
    @ApiOperation({ summary: 'BUSCAR ANIMAL VIA DONO' })
    async findByOwner(@Param('ownerId') ownerId: string): Promise<Animal> {
        return this.animalService.findByOwner(ownerId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'EDITAR ANIMAL' })
    @ApiBody({ type: UpdateAnimalDto })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('photo'))
    async update(
        @Param('id') id: string,
        @UploadedFile() photo: Express.Multer.File,
        @Body() body: UpdateAnimalDto,
    ): Promise<Animal> {
        return this.animalService.update(id, body, photo);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'DELETAR ANIMAL' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.animalService.remove(id);
    }
}

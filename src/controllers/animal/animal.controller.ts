/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnimalService } from './animal.service';
import { AnimalDto, FilterAnimalDto, UpdateAnimalDto } from './animal.dto';
import { Animal } from './animal.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@ApiTags('ANIMAL')
@ApiBearerAuth()
@Controller('animal')
export class AnimalController {
    constructor(private readonly animalService: AnimalService) { }

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Post('filter')
    @ApiOperation({ summary: 'FILTRO PARA ANIMAIS' })
    @ApiBody({ type: FilterAnimalDto })
    async findFiltered(
        @Body() body: FilterAnimalDto,
    ): Promise<Animal[]> {
        return this.animalService.findFiltered(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODOS ANIMAIS' })
    async findAll(): Promise<Animal[]> {
        return this.animalService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('family/:owner_id')
    @ApiOperation({ summary: 'TODAS OS NOMES & IDs' })
    async findNameWithId(
        @Param('owner_id') owner_id: string
    ): Promise<any> {
        return this.animalService.findNameWithId(owner_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('genealogy/:id')
    @ApiOperation({ summary: 'ARVORE GENEALÓGICA' })
    async findOneWithFamily(
        @Param('id') id: string
    ): Promise<any> {
        return this.animalService.findOneWithFamily(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('names')
    @ApiOperation({ summary: 'TODAS OS NOMES' })
    async findAllNamesWithId(): Promise<string[]> {
        return this.animalService.findAllNamesWithId();
    }

    @UseGuards(JwtAuthGuard)
    @Get('names/:property_id')
    @ApiOperation({ summary: 'TODAS OS NOMES DE UMA PROPRIEDADE' })
    async findAllNamesByProperty(
        @Param('property_id') property_id: string
    ): Promise<any[]> {
        return this.animalService.findAllNamesByProperty(property_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('breeds')
    @ApiOperation({ summary: 'TODAS AS RAÇAS' })
    async findAllBreeds(): Promise<string[]> {
        return this.animalService.findAllBreeds();
    }

    @UseGuards(JwtAuthGuard)
    @Get('coats')
    @ApiOperation({ summary: 'TODAS AS PELAGENS' })
    async findAllCoats(): Promise<string[]> {
        return this.animalService.findAllCoats();
    }

    @UseGuards(JwtAuthGuard)
    @Get('sexes')
    @ApiOperation({ summary: 'TODAS OS SEXOS' })
    async findAllSexes(): Promise<string[]> {
        return this.animalService.findAllSexes();
    }

    @UseGuards(JwtAuthGuard)
    @Get('functions')
    @ApiOperation({ summary: 'TODAS AS FUNÇÕES' })
    async findAllOccupations(): Promise<string[]> {
        return this.animalService.findAllOccupations();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'BUSCAR ANIMAL' })
    async findOne(@Param('id') id: string): Promise<Animal> {
        return this.animalService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':ownerId/owner')
    @ApiOperation({ summary: 'BUSCAR ANIMAL VIA DONO' })
    async findByOwner(@Param('ownerId') ownerId: string): Promise<Animal[]> {
        return this.animalService.findByOwner(ownerId);
    }

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'DELETAR ANIMAL' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.animalService.remove(id);
    }


}
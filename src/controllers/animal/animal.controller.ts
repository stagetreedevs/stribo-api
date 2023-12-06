/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnimalService } from './animal.service';
import { AnimalDto } from './animal.dto';
import { Animal } from './animal.entity';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('ANIMAL')
@Controller('animal')
export class AnimalController {
    constructor(private readonly animalService: AnimalService) { }

    @Post(':propertyId')
    @ApiOperation({ summary: 'CRIAR ANIMAL' })
    @ApiBody({ type: AnimalDto })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('photo'))
    async create(
        @UploadedFile() photo: Express.Multer.File,
        @Body() body: Animal,
    ): Promise<Animal> {
        return this.animalService.create(body, photo);
    }

    @Get()
    @ApiOperation({ summary: 'TODOS ANIMAIS' })
    async findAll(): Promise<Animal[]> {
        return this.animalService.findAll();
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
    @ApiBody({ type: AnimalDto })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('photo'))
    async update(
        @Param('id') id: string,
        @UploadedFile() photo: Express.Multer.File,
        @Body() body: AnimalDto,
    ): Promise<Animal> {
        return this.animalService.update(id, body, photo);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'DELETAR ANIMAL' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.animalService.remove(id);
    }
}

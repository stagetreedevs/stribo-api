/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnimalDocumentService } from './animal-document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AnimalDocumentDto } from './animal-document.dto';
@ApiTags('ANIMAL - DOCUMENTOS')
@ApiBearerAuth()
@Controller('animal-document')
export class AnimalDocumentController {
    constructor(private readonly documentService: AnimalDocumentService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'SUBIR ARQUIVO' })
    @ApiBody({ type: AnimalDocumentDto })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: AnimalDocumentDto,
    ): Promise<any> {
        return this.documentService.create(body, file);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'TODOS DOCUMENTOS' })
    async findAll(): Promise<any[]> {
        return this.documentService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':animal_id')
    @ApiOperation({ summary: 'BUSCAR DOCUMENTOS DOS ANIMAL VIA SEU ID' })
    async findOne(
        @Param('animal_id') animal_id: string
    ): Promise<any[]> {
        return this.documentService.findAnimalDocuments(animal_id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'DELETAR DOCUMENTO' })
    async remove(
        @Param('id') id: string
    ): Promise<void> {
        return this.documentService.remove(id);
    }

}
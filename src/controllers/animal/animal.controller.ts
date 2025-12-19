/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AnimalService } from './animal.service';
import {
  AnimalDto,
  UpdateAnimalDto,
  FilterAnimalDto,
  BreedDto,
  CoatDto,
} from './animal.dto';
import { Animal } from './animal.entity';
import { Breed } from './breed.entity';
import { Coat } from './coat.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
@ApiTags('ANIMAL')
@ApiBearerAuth()
@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @UseGuards(JwtAuthGuard)
  @Post('breed')
  @ApiOperation({ summary: 'CRIAR RAÇA' })
  @ApiBody({ type: BreedDto })
  async createBreed(@Body() body: BreedDto): Promise<Breed> {
    return this.animalService.createBreed(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('breed')
  @ApiOperation({ summary: 'LISTAR TODAS AS RAÇAS' })
  async findAllBreeds(): Promise<Breed[]> {
    return this.animalService.findAllBreeds();
  }

  @UseGuards(JwtAuthGuard)
  @Get('breed/:id')
  @ApiOperation({ summary: 'BUSCAR RAÇA COM SUAS PELAGENS' })
  async findBreedWithCoats(@Param('id') id: string): Promise<Breed> {
    return this.animalService.findBreedWithCoats(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('breed/:id')
  @ApiOperation({ summary: 'ATUALIZAR RAÇA' })
  @ApiBody({ type: BreedDto })
  async updateBreed(
    @Param('id') id: string,
    @Body() body: BreedDto,
  ): Promise<Breed> {
    return this.animalService.updateBreed(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('breed/:id')
  @ApiOperation({ summary: 'EXCLUIR RAÇA' })
  async deleteBreed(@Param('id') id: string): Promise<void> {
    return this.animalService.deleteBreed(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('coat')
  @ApiOperation({ summary: 'CRIAR PELAGEM' })
  @ApiBody({ type: CoatDto })
  async createCoat(@Body() body: CoatDto): Promise<Coat> {
    return this.animalService.createCoat(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('coat')
  @ApiOperation({ summary: 'LISTAR TODAS AS PELAGENS' })
  async findAllCoats(): Promise<Coat[]> {
    return this.animalService.findAllCoats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('coat/breed/:breed_id')
  @ApiOperation({ summary: 'LISTAR PELAGENS DE UMA RAÇA' })
  async findCoatsByBreed(@Param('breed_id') breed_id: string): Promise<Coat[]> {
    return this.animalService.findCoatsByBreed(breed_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('coat/:id')
  @ApiOperation({ summary: 'ATUALIZAR PELAGEM' })
  @ApiBody({ type: CoatDto })
  async updateCoat(
    @Param('id') id: string,
    @Body() body: CoatDto,
  ): Promise<Coat> {
    return this.animalService.updateCoat(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('coat/:id')
  @ApiOperation({ summary: 'EXCLUIR PELAGEM' })
  async deleteCoat(@Param('id') id: string): Promise<void> {
    return this.animalService.deleteCoat(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR ANIMAL' })
  @ApiBody({ type: AnimalDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile() photo: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true })) body: AnimalDto,
  ): Promise<Animal> {
    console.log('Animal recebido:', body);
    const animalEntity = plainToInstance(Animal, body);
    return this.animalService.create(animalEntity, photo);
  }

  @UseGuards(JwtAuthGuard)
  @Post('filter')
  @ApiOperation({ summary: 'FILTRO PARA ANIMAIS' })
  @ApiBody({ type: FilterAnimalDto })
  async findFiltered(@Body() body: FilterAnimalDto): Promise<Animal[]> {
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
  async findNameWithId(@Param('owner_id') owner_id: string): Promise<any> {
    return this.animalService.findNameWithId(owner_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('genealogy/:id')
  @ApiOperation({ summary: 'ARVORE GENEALÓGICA' })
  async findOneWithFamily(@Param('id') id: string): Promise<any> {
    return this.animalService.findOneWithFamily(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('names')
  @ApiOperation({ summary: 'TODAS OS NOMES' })
  async findAllNamesWithId(@Query('sex') sex: string) {
    return this.animalService.findAllNamesWithId(sex);
  }

  @UseGuards(JwtAuthGuard)
  @Get('names/:property_id')
  @ApiOperation({ summary: 'TODAS OS NOMES DE UMA PROPRIEDADE' })
  async findAllNamesByProperty(
    @Param('property_id') property_id: string,
    @Query('sex') sex?: string,
  ): Promise<any[]> {
    return this.animalService.findAllNamesByProperty(property_id, sex);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search/register-number')
  @ApiOperation({ summary: 'BUSCAR ANIMAL POR NÚMERO DE REGISTRO' })
  async findByRegisterNumber(
    @Query('registerNumber') registerNumber: string,
    @Query('propertyId') propertyId: string,
  ): Promise<Animal> {
    const animal = await this.animalService.findByRegisterNumber(
      registerNumber,
      propertyId,
    );

    if (!animal) {
      throw new HttpException(
        'Animal não encontrado com este número de registro',
        HttpStatus.NOT_FOUND,
      );
    }

    return animal;
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
  @Get('property/:property_id')
  @ApiOperation({ summary: 'BUSCAR ANIMAIS DE UMA PROPRIEDADE' })
  async findByProperty(
    @Param('property_id') property_id: string,
  ): Promise<Animal[]> {
    return this.animalService.findByProperty(property_id);
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

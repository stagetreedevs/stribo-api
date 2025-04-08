import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductsDTO, ProductsQueryDTO } from './dto/products.dto';
import { MovementsDTO, MovementsQueryDTO } from './dto/movements.dto';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('products')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: ProductsDTO })
  async createProduct(@Body() data: ProductsDTO) {
    return await this.propertiesService.createProduct(data);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ type: ProductsQueryDTO })
  async getAllProducts(@Query() query: ProductsQueryDTO) {
    return await this.propertiesService.getAllProducts(query);
  }

  @Get('products/details/:id')
  @ApiOperation({ summary: 'Get a product by ID' })
  async getProductById(@Param('id') id: string) {
    return await this.propertiesService.getProductById(id);
  }

  @Get('products/names')
  @ApiOperation({ summary: 'Get all product names' })
  async getAllProductNames() {
    return await this.propertiesService.getAllProductsNames();
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiBody({ type: ProductsDTO })
  async updateProduct(@Param('id') id: string, @Body() data: ProductsDTO) {
    return await this.propertiesService.updateProduct(id, data);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  async deleteProduct(@Param('id') id: string) {
    return await this.propertiesService.deleteProduct(id);
  }

  @Post('movements')
  @ApiOperation({ summary: 'Create a new movement' })
  @ApiBody({ type: MovementsDTO })
  async createMovement(@Body() data: MovementsDTO) {
    return await this.propertiesService.createMovement(data);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Get all movements' })
  @ApiQuery({ type: MovementsQueryDTO })
  async getAllMovements(@Query() query: MovementsQueryDTO) {
    return await this.propertiesService.getAllMovements(query);
  }

  @Get('movements/details/:id')
  @ApiOperation({ summary: 'Get a movement by ID' })
  async getMovementById(@Param('id') id: string) {
    return await this.propertiesService.getMovementById(id);
  }

  @Put('movements/:id')
  @ApiOperation({ summary: 'Update a movement by ID' })
  @ApiBody({ type: MovementsDTO })
  async updateMovement(@Param('id') id: string, @Body() data: MovementsDTO) {
    return await this.propertiesService.updateMovement(id, data);
  }

  @Delete('movements/:id')
  @ApiOperation({ summary: 'Delete a movement by ID' })
  async deleteMovement(@Param('id') id: string) {
    return await this.propertiesService.deleteMovement(id);
  }
}

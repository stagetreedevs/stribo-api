import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsDTO, ProductsQueryDTO } from './dto/products.dto';
import { MovementsDTO, MovementsQueryDTO } from './dto/movements.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('products')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: ProductsDTO })
  async createProduct(@Body() data: ProductsDTO) {
    return await this.propertiesService.createProduct(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ type: ProductsQueryDTO })
  async getAllProducts(@Query() query: ProductsQueryDTO) {
    return await this.propertiesService.getAllProducts(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('products/details/:id')
  @ApiOperation({ summary: 'Get a product by ID' })
  async getProductById(@Param('id') id: string) {
    return await this.propertiesService.getProductById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('products/names')
  @ApiOperation({ summary: 'Get all product names' })
  async getAllProductNames() {
    return await this.propertiesService.getAllProductsNames();
  }

  @UseGuards(JwtAuthGuard)
  @Put('products/:id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiBody({ type: ProductsDTO })
  async updateProduct(@Param('id') id: string, @Body() data: ProductsDTO) {
    return await this.propertiesService.updateProduct(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  async deleteProduct(@Param('id') id: string) {
    return await this.propertiesService.deleteProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('movements')
  @ApiOperation({ summary: 'Create a new movement' })
  @ApiBody({ type: MovementsDTO })
  async createMovement(@Body() data: MovementsDTO) {
    data.datetime = new Date(data.datetime);

    return await this.propertiesService.createMovement(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('movements')
  @ApiOperation({ summary: 'Get all movements' })
  @ApiQuery({ type: MovementsQueryDTO })
  async getAllMovements(@Query() query: MovementsQueryDTO) {
    query.start_date = new Date(query.start_date);
    query.end_date = new Date(query.end_date);

    return await this.propertiesService.getAllMovements(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('movements/details/:id')
  @ApiOperation({ summary: 'Get a movement by ID' })
  async getMovementById(@Param('id') id: string) {
    return await this.propertiesService.getMovementById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('movements/:id')
  @ApiOperation({ summary: 'Update a movement by ID' })
  @ApiBody({ type: MovementsDTO })
  async updateMovement(@Param('id') id: string, @Body() data: MovementsDTO) {
    data.datetime = new Date(data.datetime);

    return await this.propertiesService.updateMovement(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('movements/:id')
  @ApiOperation({ summary: 'Delete a movement by ID' })
  async deleteMovement(@Param('id') id: string) {
    return await this.propertiesService.deleteMovement(id);
  }
}

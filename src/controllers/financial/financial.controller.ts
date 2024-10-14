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
import { FinancialService } from './financial.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BankAccountDTO, FilterBankAccountDTO } from './dto/bank-account.dto';
import { BankAccount } from './entity/bank-account.entity';
import { CategoryDTO, FilterCategoryDTO } from './dto/category.dto';
import { Category } from './entity/category.entity';
@ApiBearerAuth()
@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  // ** Bank Account **
  @ApiTags('CONTA BANCÁRIA')
  @UseGuards(JwtAuthGuard)
  @Post('bank-account')
  @ApiOperation({ summary: 'CRIA UMA CONTA BANCÁRIA' })
  @ApiBody({ type: BankAccountDTO })
  async createBankAccount(@Body() body: BankAccountDTO): Promise<BankAccount> {
    return this.financialService.createBankAccount(body);
  }

  @ApiTags('CONTA BANCÁRIA')
  @UseGuards(JwtAuthGuard)
  @Get('bank-account')
  @ApiOperation({ summary: 'TODAS CONTAS BANCÁRIAS' })
  async findAllBankAccount(
    @Query() query: FilterBankAccountDTO,
  ): Promise<BankAccount[]> {
    return this.financialService.findAllBankAccount(query.property_id);
  }

  @ApiTags('CONTA BANCÁRIA')
  @UseGuards(JwtAuthGuard)
  @Get('bank-account/details/:id')
  @ApiOperation({ summary: 'BUSCA UMA CONTA BANCÁRIA' })
  async findOneBankAccount(@Param('id') id: string): Promise<BankAccount> {
    return this.financialService.findOneBankAccount(id);
  }

  @ApiTags('CONTA BANCÁRIA')
  @UseGuards(JwtAuthGuard)
  @Get('bank-account/names')
  @ApiOperation({ summary: 'NOMES DAS CONTAS BANCÁRIAS' })
  async findNamesBankAccount(
    @Query() query: FilterBankAccountDTO,
  ): Promise<{ label: string; value: string }[]> {
    return this.financialService.findNamesBankAccount(query.property_id);
  }

  @ApiTags('CONTA BANCÁRIA')
  @UseGuards(JwtAuthGuard)
  @Put('bank-account/:id')
  @ApiOperation({ summary: 'ATUALIZA UMA CONTA BANCÁRIA' })
  @ApiBody({ type: BankAccountDTO })
  async updateBankAccount(
    @Param('id') id: string,
    @Body() body: BankAccountDTO,
  ): Promise<BankAccount> {
    return this.financialService.updateBankAccount(id, body);
  }

  @ApiTags('CONTA BANCÁRIA')
  @UseGuards(JwtAuthGuard)
  @Delete('bank-account/:id')
  @ApiOperation({ summary: 'REMOVE UMA CONTA BANCÁRIA' })
  async removeBankAccount(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.financialService.removeBankAccount(id);
  }

  // ** Category **
  @ApiTags('CATEGORIA')
  @UseGuards(JwtAuthGuard)
  @Post('category')
  @ApiOperation({ summary: 'CRIA UMA CATEGORIA' })
  @ApiBody({ type: CategoryDTO })
  async createCategory(@Body() body: CategoryDTO): Promise<Category> {
    return this.financialService.createCategory(body);
  }

  @ApiTags('CATEGORIA')
  @UseGuards(JwtAuthGuard)
  @Get('category')
  @ApiOperation({ summary: 'TODAS CATEGORIAS' })
  async findAllCategories(
    @Query() query: FilterCategoryDTO,
  ): Promise<Category[]> {
    return this.financialService.findAllCategories(query);
  }

  @ApiTags('CATEGORIA')
  @UseGuards(JwtAuthGuard)
  @Get('category/details/:id')
  @ApiOperation({ summary: 'BUSCA UMA CATEGORIA' })
  async findOneCategory(@Param('id') id: string): Promise<Category> {
    return this.financialService.findOneCategory(id);
  }

  @ApiTags('CATEGORIA')
  @UseGuards(JwtAuthGuard)
  @Get('category/names')
  @ApiOperation({ summary: 'NOMES DAS CATEGORIAS' })
  async findCategoryNames(
    @Query() query: FilterCategoryDTO,
  ): Promise<{ label: string; value: string }[]> {
    return this.financialService.findCategoryNames(query);
  }

  @ApiTags('CATEGORIA')
  @UseGuards(JwtAuthGuard)
  @Put('category/:id')
  @ApiOperation({ summary: 'ATUALIZA UMA CATEGORIA' })
  @ApiBody({ type: CategoryDTO })
  async updateCategory(
    @Param('id') id: string,
    @Body() body: CategoryDTO,
  ): Promise<Category> {
    return this.financialService.updateCategory(id, body);
  }

  @ApiTags('CATEGORIA')
  @UseGuards(JwtAuthGuard)
  @Delete('category/:id')
  @ApiOperation({ summary: 'REMOVE UMA CATEGORIA' })
  async removeCategory(@Param('id') id: string): Promise<{ message: string }> {
    return this.financialService.removeCategory(id);
  }
}

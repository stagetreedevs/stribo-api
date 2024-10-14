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
    return this.financialService.create(body);
  }

  @ApiTags('CONTA BANCÁRIA')
  //@UseGuards(JwtAuthGuard)
  @Get('bank-account')
  @ApiOperation({ summary: 'TODAS CONTAS BANCÁRIAS' })
  async findAllBankAccount(
    @Query() query: FilterBankAccountDTO,
  ): Promise<BankAccount[]> {
    return this.financialService.findAll(query.property_id);
  }

  @ApiTags('CONTA BANCÁRIA')
  @UseGuards(JwtAuthGuard)
  @Get('bank-account/details/:id')
  @ApiOperation({ summary: 'BUSCA UMA CONTA BANCÁRIA' })
  async findOneBankAccount(@Param('id') id: string): Promise<BankAccount> {
    return this.financialService.findOne(id);
  }

  @ApiTags('CONTA BANCÁRIA')
  @UseGuards(JwtAuthGuard)
  @Get('bank-account/names')
  @ApiOperation({ summary: 'NOMES DAS CONTAS BANCÁRIAS' })
  async findNamesBankAccount(
    @Query() query: FilterBankAccountDTO,
  ): Promise<{ label: string; value: string }[]> {
    return this.financialService.findNames(query.property_id);
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
    return this.financialService.update(id, body);
  }

  @ApiTags('CONTA BANCÁRIA')
  @UseGuards(JwtAuthGuard)
  @Delete('bank-account/:id')
  @ApiOperation({ summary: 'REMOVE UMA CONTA BANCÁRIA' })
  async removeBankAccount(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.financialService.remove(id);
  }
}

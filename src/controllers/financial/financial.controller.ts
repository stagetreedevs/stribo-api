import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FinancialService } from './financial.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BankAccountDTO, FilterBankAccountDTO } from './dto/bank-account.dto';
import { BankAccount } from './entity/bank-account.entity';
import { CategoryDTO, FilterCategoryDTO } from './dto/category.dto';
import { Category } from './entity/category.entity';
import {
  DocumentsDTO,
  ImportTransactionDTO,
  TransactionDTO,
  TransactionUpdateDTO,
} from './dto/transaction.dto';
import { QueryTransaction, Transaction } from './entity/transaction.entity';
import { InstallmentStatus } from './entity/installment.entity';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
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
  //@UseGuards(JwtAuthGuard)
  @Get('category/names')
  @ApiOperation({ summary: 'NOMES DAS CATEGORIAS' })
  async findCategoryNames(
    @Query() query: FilterCategoryDTO,
  ): Promise<{ label: string; value: string }[]> {
    return this.financialService.findCategoryNames(query);
  }

  @ApiTags('CATEGORIA')
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'CAMPOS DA CATEGORIA' })
  @Get('category/:id/fields')
  async getFieldsByCategoryId(
    @Param('id') id: string,
    @Query('property_id') property_id: string,
  ) {
    return this.financialService.getFieldsByCategoryId(id, property_id);
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

  // ** Transaction **
  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Post('transaction')
  @ApiOperation({ summary: 'CRIA UMA TRANSAÇÃO' })
  @ApiBody({ type: TransactionDTO })
  async createTransaction(@Body() body: TransactionDTO): Promise<Transaction> {
    return this.financialService.createTransaction(body);
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Put('transaction/:id')
  @ApiOperation({ summary: 'ATUALIZA UMA TRANSAÇÃO' })
  @ApiBody({ type: TransactionDTO })
  async updateTransaction(
    @Param('id') id: string,
    @Body() body: TransactionUpdateDTO,
  ): Promise<Transaction> {
    return this.financialService.updateTransaction(id, body);
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Get('transaction')
  @ApiOperation({ summary: 'TODAS TRANSAÇÕES' })
  async findAllTransactions(): Promise<Transaction[]> {
    return this.financialService.getAllTransactions();
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Get('transaction/grouped')
  @ApiOperation({ summary: 'TRANSAÇÕES AGRUPADAS' })
  async findGroupedTransactions(@Query() query: QueryTransaction) {
    return this.financialService.getAllTransactionsGroupedByDate(query);
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Post('transaction/:id/documents')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'contract_file',
        maxCount: 1,
      },
      {
        name: 'invoice_file',
        maxCount: 1,
      },
      {
        name: 'receipt_file',
        maxCount: 1,
      },
      {
        name: 'attachments_files',
        maxCount: 1,
      },
    ]),
  )
  @ApiOperation({ summary: 'ADICIONA DOCUMENTOS A TRANSAÇÃO' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: DocumentsDTO,
    description: 'Arquivos para upload',
  })
  async addDocuments(
    @Param('id') id: string,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ): Promise<Transaction> {
    return this.financialService.updateDocuments(id, files);
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Delete('transaction/:id/attachments')
  @ApiOperation({ summary: 'REMOVER ANEXOS DE UMA TRANSAÇÃO' })
  async removeDocuments(
    @Param('id') id: string,
    @Query('index') index: number,
  ) {
    try {
      index = Number(index);
      if (isNaN(index)) {
        throw new BadRequestException('Index must be a number');
      }
    } catch (error) {
      throw new BadRequestException('Index must be a number');
    }

    return this.financialService.removeAttachmentFile(id, index);
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Delete('transaction/:id/file')
  @ApiOperation({ summary: 'REMOVER ARQUIVO DE UMA TRANSAÇÃO' })
  async removeFile(
    @Param('id') id: string,
    @Query('file') file: string,
  ): Promise<Transaction> {
    return this.financialService.removeFile(id, file);
  }

  @ApiTags('TRANSAÇÃO')
  // @UseGuards(JwtAuthGuard)
  @Get('transaction/analysis/:property_id')
  @ApiOperation({ summary: 'ANÁLISE DE TRANSAÇÕES' })
  async getTransactionAnalysis(@Param('property_id') property_id: string) {
    return this.financialService.getAnalyticsTransactions(property_id);
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Get('transaction/details/:id')
  @ApiOperation({ summary: 'BUSCA UMA TRANSAÇÃO' })
  async findOneTransaction(@Param('id') id: string): Promise<Transaction> {
    return this.financialService.getTransactionById(id);
  }

  @ApiTags('TRANSAÇÃO')
  // @UseGuards(JwtAuthGuard)
  @Get('transaction/competition/:id/expenses')
  @ApiOperation({ summary: 'DESPESAS DE UMA COMPETIÇÃO' })
  async getExpensesByCompetitionId(@Param('id') id: string) {
    return this.financialService.getExpensesByCompetitionId(id);
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Patch('transaction/installments/:id/status/:status')
  @ApiOperation({ summary: 'ATUALIZA O STATUS DE UMA TRANSAÇÃO' })
  async updateInstallmentStatus(
    @Param('id') id: string,
    @Param('status') status: InstallmentStatus,
  ) {
    return this.financialService.updateStatusInstallment(id, status);
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Delete('transaction/:id')
  @ApiOperation({ summary: 'REMOVE UMA TRANSAÇÃO' })
  async removeTransaction(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.financialService.deleteTransaction(id);
  }

  @Delete('transaction')
  @ApiTags('TRANSAÇÃO')
  @ApiOperation({ summary: 'REMOVE TODAS AS TRANSAÇÕES' })
  async removeAllTransaction(): Promise<{ message: string }> {
    return this.financialService.deleteAllTransactions();
  }

  @ApiTags('TRANSAÇÃO')
  @UseGuards(JwtAuthGuard)
  @Get('transaction/quantity-bank-account-and-category')
  @ApiOperation({ summary: 'QUANTIDADE DE TRANSAÇÕES POR CONTA E CATEGORIA' })
  async getTransactionQuantity(@Query('property_id') property_id: string) {
    return this.financialService.getQuantityBankAccountAndCategory(property_id);
  }

  @ApiTags('TRANSAÇÃO')
  // @UseGuards(JwtAuthGuard)
  @Post('transaction/import-ofx')
  @ApiOperation({ summary: 'IMPORTA ARQUIVO OFX' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    type: ImportTransactionDTO,
  })
  async importOfx(
    @UploadedFile() file: Express.Multer.File,
    @Query('property_id') property_id: string,
  ) {
    return this.financialService.importTransactionsByOfx(file, property_id);
  }
}

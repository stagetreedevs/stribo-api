import { ApiProperty } from '@nestjs/swagger';
import {
  CommissionType,
  ExtraField,
  TransactionImportSource,
  TransactionType,
} from '../entity/transaction.entity';

export enum Period {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  BIMONTHLY = 'bimonthly',
  QUARTERLY = 'quarterly',
  SEMIANNUALLY = 'semiannually',
  ANNUALLY = 'annually',
}

export class TransactionDTO {
  @ApiProperty()
  property_id: string;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty()
  datetime: Date;

  @ApiProperty()
  description: string;

  @ApiProperty()
  bank_account_id: string;

  @ApiProperty()
  category_id?: string;

  @ApiProperty({ type: ExtraField, isArray: true })
  extra_fields: ExtraField[];

  @ApiProperty()
  original_value: number;

  @ApiProperty({ required: false, enum: CommissionType })
  commission_type?: CommissionType;

  @ApiProperty({ required: false })
  commission_value?: number;

  @ApiProperty({ required: false })
  beneficiary_name?: string;

  @ApiProperty({ required: false, default: false })
  is_periodically?: boolean;

  @ApiProperty({ required: false, enum: Period })
  period?: Period;

  @ApiProperty({ required: false, default: false })
  is_installment?: boolean;

  @ApiProperty({ required: false })
  installments?: number;

  @ApiProperty({ required: false })
  due_date?: Date;

  @ApiProperty({ required: false })
  max_date_period?: Date;

  @ApiProperty({ required: false, description: 'CPF/CNPJ do pagador (usado na geração manual do boleto)' })
  CPF?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false, description: 'Valor de entrada para receita parcelada (centavos)' })
  entry_value?: number;

  @ApiProperty({
    required: false,
    enum: TransactionImportSource,
    description: 'Origem do lançamento (ex.: ofx para importação de extrato)',
  })
  import_source?: TransactionImportSource;
}

export class GenerateRevenueBankSlipDTO {
  @ApiProperty({
    required: false,
    description: 'CPF/CNPJ do pagador (usa o salvo na transação se omitido)',
  })
  CPF?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  beneficiary_name?: string;

  @ApiProperty({ required: false, description: 'Valor de entrada em centavos' })
  entry_value?: number;
}

export class TransactionUpdateDTO {
  @ApiProperty()
  type: TransactionType;

  @ApiProperty()
  datetime: Date;

  @ApiProperty()
  description: string;

  @ApiProperty()
  bank_account_id: string;

  @ApiProperty()
  category_id?: string;

  @ApiProperty({ type: ExtraField, isArray: true })
  extra_fields: ExtraField[];

  @ApiProperty()
  original_value: number;

  @ApiProperty({ required: false, enum: CommissionType })
  commission_type?: CommissionType;

  @ApiProperty({ required: false })
  commission_value?: number;

  @ApiProperty({ required: false })
  beneficiary_name?: string;
}

export class DocumentsDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  contract_file: Express.Multer.File[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  invoice_file: Express.Multer.File[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  receipt_file: Express.Multer.File[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  attachments_files: Express.Multer.File[];
}

export class ImportTransactionDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;
}

import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Costumer } from './customers.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export enum PaymentStatus {
  NOT_EXIST = 'NOT_EXIST',
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  CONFIRMED = 'CONFIRMED',
  OVERDUE = 'OVERDUE',
  REFUNDED = 'REFUNDED',
  RECEIVED_IN_CASH = 'RECEIVED_IN_CASH',
  REFUND_REQUESTED = 'REFUND_REQUESTED',
  REFUND_IN_PROGRESS = 'REFUND_IN_PROGRESS',
  CHARGEBACK_REQUESTED = 'CHARGEBACK_REQUESTED',
  CHARGEBACK_DISPUTE = 'CHARGEBACK_DISPUTE',
  AWAITING_CHARGEBACK_REVERSAL = 'AWAITING_CHARGEBACK_REVERSAL',
  DUNNING_REQUESTED = 'DUNNING_REQUESTED',
  DUNNING_RECEIVED = 'DUNNING_RECEIVED',
  AWAITING_RISK_ANALYSIS = 'AWAITING_RISK_ANALYSIS',
}

export enum BillingType {
  BOLETO = 'BOLETO',
  CREDIT_CARD = 'CREDIT_CARD',
  PIX = 'PIX',
}

export enum CreditCardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  ELO = 'ELO',
  AMEX = 'AMEX',
  HIPERCARD = 'HIPERCARD',
  UNKNOWN = 'UNKNOWN',
}

export class CreditCard {
  creditCardNumber: string;
  creditCardBrand: CreditCardBrand;
  creditCardToken: string;
}

export class CreditCardCreatePayment {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  holderName: string;

  @ApiProperty({ example: '4444444444444444' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: '12' })
  @IsString()
  @IsNotEmpty()
  expiryMonth: string;

  @ApiProperty({ example: '2028' })
  @IsString()
  @IsNotEmpty()
  expiryYear: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  ccv: string;
}

export class CreditCardHolderInfo {
  @ApiProperty({ example: 'João da Silva', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'joao@email.com', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  addressNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  mobilePhone?: string;
}

export class Discount {
  value: number;
  dueDateLimitDays: number;
  type: 'FIXED' | 'PERCENTAGE';
}

export class Payment {
  id: string;
  dateCreated: Date;
  customer: string;
  installment: string;
  paymentLink: string;
  value: number;
  netValue: number;
  description: string;
  billingType: BillingType;
  status: PaymentStatus;
  dueDate: string;
  paymentDate: Date;
  clientPaymentDate: Date;
  installmentNumber: number;
  invoiceUrl: string;
  invoiceNumber: string;
  externalReference: string;
  deleted: boolean;
  transactionReceiptUrl: string;
  nossoNumero: string;
  bankSlipUrl: string;
  discount?: Discount;
}

export class CreatePaymentDto {
  customer: string;
  billingType: BillingType;
  value: number;
  externalReference: string;
  description?: string;
  dueDate?: string;
  discount?: Discount;
  installmentCount?: number;
  totalValue?: number;
  creditCardHolderInfo?: CreditCardHolderInfo;
  creditCard?: CreditCardCreatePayment;
}

export class Pix {
  encodedImage: string;
  payload: string;
  expirationDate: Date;
}

export class BankSlip {
  identificationField: string;
  nossoNumero: string;
  barCode: string;
  bankSlipUrl: string;
  daysAfterDueDateToRegistrationCancellation: number;
}

export class BillingInfo {
  pix?: Pix;
  creditCard?: CreditCard;
  bankSlip?: BankSlip;
}

export class PaymentSummary {
  dueDate: string;
  value: number;
  installmentNumber: number;
  status: PaymentStatus;
  currentInstallment: boolean;
}

export class CreatePaymentResponse {
  payment: Payment;
  billing_info: BillingInfo;
  costumer: Costumer;
  currentPayment: number;
  installment_summary?: PaymentSummary[];
}

export class AsaasListPaymentResponse {
  object: string;
  hasMore: boolean;
  totalCount: number;
  limit: number;
  offset: number;
  data: Payment[];
}

export class PayWithCreditCardDto {
  @ApiProperty({ type: CreditCardCreatePayment })
  creditCard: CreditCardCreatePayment;

  @ApiProperty({ type: CreditCardHolderInfo })
  creditCardHolderInfo: CreditCardHolderInfo;
}

export class CreateCheckoutDto {
  @ApiProperty({ enum: BillingType, example: BillingType.PIX })
  @IsEnum(BillingType)
  @IsNotEmpty()
  billingType: BillingType;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(1)
  value: number;

  @ApiProperty({ example: 'Pagamento de serviço', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-07-15', required: false })
  @IsString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  @Min(2)
  installmentCount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  referenceType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ValidateIf((o) => o.billingType === BillingType.CREDIT_CARD)
  @ApiProperty({ type: CreditCardCreatePayment, required: false })
  @IsOptional()
  creditCard?: CreditCardCreatePayment;

  @ValidateIf((o) => o.billingType === BillingType.CREDIT_CARD)
  @ApiProperty({ type: CreditCardHolderInfo, required: false })
  @IsOptional()
  creditCardHolderInfo?: CreditCardHolderInfo;
}

export class CheckoutResponseDto extends CreatePaymentResponse {
  checkout_id: string;
  referenceType?: string;
  referenceId?: string;
}

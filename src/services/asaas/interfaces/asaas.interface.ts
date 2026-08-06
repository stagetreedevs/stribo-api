import {
  Costumer,
  CreateCostumerDto,
  UpdateCostumerDto,
} from '../dto/customers.dto';
import {
  BillingInfo,
  CreatePaymentDto,
  CreatePaymentResponse,
  CreditCard,
  CreditCardCreatePayment,
  CreditCardHolderInfo,
  Payment,
  PaymentStatus,
} from '../dto/payments.dto';
import { AsaasIntegrationStatusDto } from '../dto/integration-status.dto';

export interface IAsaasService {
  createCostumer(data: CreateCostumerDto): Promise<Costumer>;
  getCostumer(id: string): Promise<Costumer>;
  updateCostumer(id: string, data: UpdateCostumerDto): Promise<Costumer>;

  createPayment(data: CreatePaymentDto): Promise<CreatePaymentResponse>;
  getPaymentsByExternalReference(
    external_reference: string,
    installmentNumber?: number,
  ): Promise<CreatePaymentResponse>;
  getPaymentsByCustomer(customer: string, page?: number): Promise<Payment[]>;
  getBillingInfoByPayment(payment: string): Promise<BillingInfo>;
  getStatusPaymentByExternalReference(
    external_reference: string,
  ): Promise<{ status: PaymentStatus }>;
  getPaymentsByInstallment(
    installment: string,
    page?: number,
  ): Promise<Payment[]>;
  getPaymentById(id: string): Promise<Payment>;
  payWithCreditCard(
    payment: string,
    data: {
      creditCardHolderInfo: CreditCardHolderInfo;
      creditCard: CreditCardCreatePayment;
      remoteIp?: string;
    },
  ): Promise<Payment>;
  deletePaymentsByExternalReference(external_reference: string): Promise<void>;
  deleteInstallment(installment: string): Promise<void>;
  verifyIntegration(): Promise<AsaasIntegrationStatusDto>;
}

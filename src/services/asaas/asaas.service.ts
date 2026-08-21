import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { addDays, format } from 'date-fns';
import { IAsaasService } from './interfaces/asaas.interface';
import {
  Costumer,
  CreateCostumerDto,
  UpdateCostumerDto,
} from './dto/customers.dto';
import {
  AsaasListPaymentResponse,
  BillingInfo,
  BillingType,
  CreatePaymentDto,
  CreatePaymentResponse,
  UpdatePaymentDto,
  CreditCardCreatePayment,
  CreditCardHolderInfo,
  Payment,
  PaymentStatus,
} from './dto/payments.dto';
import { AsaasIntegrationStatusDto } from './dto/integration-status.dto';

@Injectable()
export class AsaasService implements IAsaasService, OnModuleInit {
  private readonly logger = new Logger(AsaasService.name);
  private readonly PATH = '/customers';
  private readonly DUE_DATE = 5;
  private readonly LIMIT = 100;
  private readonly USER_AGENT = 'stribo-api/1.0 (NestJS)';

  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.configureHttpClient();
  }

  private normalizeBaseUrl(url: string): string {
    const value = url.trim().replace(/\/$/, '');

    if (!value) {
      return '';
    }

    if (value.includes('sandbox.asaas.com') && !value.endsWith('/v3')) {
      return 'https://api-sandbox.asaas.com/v3';
    }

    if (value === 'https://api.asaas.com' || value === 'http://api.asaas.com') {
      return 'https://api.asaas.com/v3';
    }

    return value;
  }

  private normalizeAccessToken(token: string): string {
    let value = token.trim();

    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1).trim();
    }

    if (value.startsWith('$$')) {
      value = value.slice(1);
    }

    if (!value.startsWith('$') && /^aact_(hmlg|prod|ysnd)_/.test(value)) {
      return `$${value}`;
    }

    return value;
  }

  private configureHttpClient(): {
    baseURL: string | null;
    accessToken: string | null;
    configured: boolean;
  } {
    const baseURL = this.normalizeBaseUrl(process.env.PAYMENT_API || '');
    const accessToken = this.normalizeAccessToken(
      process.env.PAYMENT_ACCESS_TOKEN || '',
    );

    if (!baseURL || !accessToken) {
      this.logger.warn(
        'PAYMENT_API ou PAYMENT_ACCESS_TOKEN não configurados. Integração Asaas indisponível.',
      );
      return { baseURL: null, accessToken: null, configured: false };
    }

    const axios = this.httpService.axiosRef;
    axios.defaults.baseURL = baseURL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['User-Agent'] = this.USER_AGENT;
    axios.defaults.headers.common['access_token'] = accessToken;

    return { baseURL, accessToken, configured: true };
  }

  private detectEnvironment(
    baseURL: string,
    accessToken: string,
  ): 'sandbox' | 'production' | 'unknown' {
    if (baseURL.includes('sandbox') || accessToken.includes('_hmlg_')) {
      return 'sandbox';
    }

    if (accessToken.includes('_prod_')) {
      return 'production';
    }

    return 'unknown';
  }

  private buildAuthHints(
    baseURL: string,
    accessToken: string,
    httpStatus?: number,
    asaasErrors?: Array<{ code: string; description: string }>,
  ): string[] {
    const hints: string[] = [];
    const isSandboxUrl = baseURL.includes('sandbox');
    const isSandboxKey = accessToken.includes('_hmlg_');
    const isProductionKey = accessToken.includes('_prod_');

    if (isSandboxUrl && isProductionKey) {
      hints.push(
        'Você está usando chave de PRODUÇÃO com URL de SANDBOX. Gere uma chave em sandbox.asaas.com',
      );
    }

    if (!isSandboxUrl && isSandboxKey) {
      hints.push(
        'Você está usando chave de SANDBOX com URL de PRODUÇÃO. Use https://api-sandbox.asaas.com/v3',
      );
    }

    if (!accessToken.startsWith('$')) {
      hints.push(
        "A chave deve começar com $. No .env use aspas: PAYMENT_ACCESS_TOKEN='$aact_hmlg_...'",
      );
    }

    if (httpStatus === 401) {
      hints.push(
        'Verifique se a chave não expirou ou foi desabilitada no painel Asaas (Integrações > Chaves de API)',
      );
      hints.push(
        'Confirme PAYMENT_API=https://api-sandbox.asaas.com/v3 (sandbox) ou https://api.asaas.com/v3 (produção)',
      );
    }

    const errorCodes = asaasErrors?.map((error) => error.code) || [];

    if (errorCodes.includes('access_token_not_found')) {
      hints.push(
        'O header access_token não está chegando na API. Reinicie o servidor após alterar o .env',
      );
    }

    if (errorCodes.includes('invalid_access_token')) {
      hints.push('A chave de API é inválida. Gere uma nova no painel Asaas');
    }

    if (!hints.length) {
      hints.push(
        'Revise PAYMENT_API e PAYMENT_ACCESS_TOKEN no .env e reinicie a aplicação',
      );
    }

    return hints;
  }

  async verifyIntegration(): Promise<AsaasIntegrationStatusDto> {
    const config = this.configureHttpClient();

    if (!config.configured) {
      return {
        success: false,
        configured: false,
        connected: false,
        message: 'Variáveis de ambiente não configuradas',
        hints: [
          'PAYMENT_API=https://api-sandbox.asaas.com/v3',
          "PAYMENT_ACCESS_TOKEN='$aact_hmlg_sua_chave_aqui' (use aspas por causa do $)",
        ],
      };
    }

    const environment = this.detectEnvironment(
      config.baseURL,
      config.accessToken,
    );
    const tokenPreview = `${config.accessToken.substring(0, 16)}...`;

    try {
      const response = await this.httpService.axiosRef.get('/myAccount');

      return {
        success: true,
        configured: true,
        connected: true,
        environment,
        message: 'Integração com Asaas funcionando corretamente',
        apiUrl: config.baseURL,
        tokenPreview,
        account: {
          name: response.data?.name,
          email: response.data?.email,
          cpfCnpj: response.data?.cpfCnpj,
        },
      };
    } catch (error) {
      const httpStatus = error.response?.status;
      const asaasErrors = error.response?.data?.errors;

      this.logger.error(
        'Falha ao verificar integração Asaas',
        JSON.stringify({ httpStatus, asaasErrors }),
      );

      return {
        success: false,
        configured: true,
        connected: false,
        environment,
        message: 'Não foi possível autenticar com o Asaas',
        apiUrl: config.baseURL,
        tokenPreview,
        httpStatus,
        asaasErrors,
        hints: this.buildAuthHints(
          config.baseURL,
          config.accessToken,
          httpStatus,
          asaasErrors,
        ),
      };
    }
  }

  async createCostumer(data: CreateCostumerDto): Promise<Costumer> {
    const response = await this.httpService.axiosRef.post<Costumer>(
      this.PATH,
      data,
    );
    return response.data;
  }

  async findCostumerByCpfCnpj(cpfCnpj: string): Promise<Costumer | null> {
    const cleaned = String(cpfCnpj || '').replace(/\D/g, '');
    if (!cleaned) {
      return null;
    }

    const response = await this.httpService.axiosRef.get<{ data: Costumer[] }>(
      this.PATH,
      { params: { cpfCnpj: cleaned } },
    );

    return response.data?.data?.[0] || null;
  }

  async getOrCreateCostumer(data: CreateCostumerDto): Promise<Costumer> {
    const existing = await this.findCostumerByCpfCnpj(data.cpfCnpj);
    if (existing) {
      return existing;
    }
    return this.createCostumer(data);
  }

  async getCostumer(id: string): Promise<Costumer> {
    const response = await this.httpService.axiosRef.get<Costumer>(
      `${this.PATH}/${id}`,
    );
    return response.data;
  }

  async updateCostumer(id: string, data: UpdateCostumerDto): Promise<Costumer> {
    const response = await this.httpService.axiosRef.put<Costumer>(
      `${this.PATH}/${id}`,
      data,
    );
    return response.data;
  }

  async createPayment(data: CreatePaymentDto): Promise<CreatePaymentResponse> {
    if (
      !data.customer ||
      !data.billingType ||
      !data.value ||
      !data.externalReference
    ) {
      throw new ForbiddenException(
        'Customer, billing type, value e external reference são obrigatórios',
      );
    }

    if (
      data.billingType === BillingType.CREDIT_CARD &&
      (!data.creditCardHolderInfo || !data.creditCardHolderInfo.cpfCnpj)
    ) {
      throw new ForbiddenException(
        'Dados do titular do cartão são obrigatórios para pagamento com cartão',
      );
    }

    if (data.installmentCount) {
      data.totalValue = data.value;
    }

    if (!data.dueDate) {
      const dueDate = addDays(new Date(), this.DUE_DATE);
      data.dueDate = format(dueDate, 'yyyy-MM-dd');
    }

    const { data: payment_data } =
      await this.httpService.axiosRef.post<Payment>('/payments', data);

    let installment_summary: Payment[] = [];

    if (payment_data.installment) {
      installment_summary = await this.getPaymentsByInstallment(
        payment_data.installment,
      );
    }

    const billing_info = await this.getBillingInfoByPayment(payment_data.id);
    const costumer = await this.getCostumer(payment_data.customer);

    const currentPayment =
      installment_summary.find(
        (installment) =>
          installment.status !== PaymentStatus.CONFIRMED &&
          installment.status !== PaymentStatus.RECEIVED &&
          installment.status !== PaymentStatus.RECEIVED_IN_CASH,
      ) || payment_data;

    return {
      payment: payment_data,
      billing_info,
      costumer,
      currentPayment: currentPayment.installmentNumber,
      installment_summary: installment_summary
        .map((installment) => ({
          dueDate: installment.dueDate,
          installmentNumber: installment.installmentNumber,
          value: installment.value,
          status: installment.status,
          currentInstallment: installment.id === payment_data.id,
        }))
        .reverse(),
    };
  }

  async getPaymentsByInstallment(
    installment: string,
    page = 0,
  ): Promise<Payment[]> {
    const offset = page * this.LIMIT;
    const response =
      await this.httpService.axiosRef.get<AsaasListPaymentResponse>(
        `/installments/${installment}/payments`,
        { params: { limit: this.LIMIT, offset } },
      );
    return response.data.data;
  }

  async getPaymentsByExternalReference(
    external_reference: string,
    installmentNumber: number | null = null,
    page = 0,
  ): Promise<CreatePaymentResponse> {
    const offset = page * this.LIMIT;
    const response =
      await this.httpService.axiosRef.get<AsaasListPaymentResponse>(
        '/payments',
        {
          params: {
            externalReference: external_reference,
            limit: this.LIMIT,
            offset,
          },
        },
      );

    let { data: listPayments } = response.data;

    if (!listPayments.length) {
      throw new ForbiddenException('Pagamento não encontrado');
    }

    if (!listPayments[0].installment) {
      installmentNumber = null;
    }

    listPayments = listPayments.reverse();

    let payment_data = !installmentNumber
      ? listPayments.find(
        (payment) =>
          payment.status !== PaymentStatus.CONFIRMED &&
          payment.status !== PaymentStatus.RECEIVED &&
          payment.status !== PaymentStatus.RECEIVED_IN_CASH,
      )
      : listPayments.find(
        (payment) => payment.installmentNumber === installmentNumber,
      );

    if (!payment_data) {
      payment_data = listPayments[0];
    }

    let installment_summary: Payment[] = [];

    if (payment_data.installment) {
      installment_summary = await this.getPaymentsByInstallment(
        payment_data.installment,
      );
    }

    const billing_info = await this.getBillingInfoByPayment(payment_data.id);
    const costumer = await this.getCostumer(payment_data.customer);

    const currentPayment =
      listPayments.find(
        (payment) =>
          payment.status !== PaymentStatus.CONFIRMED &&
          payment.status !== PaymentStatus.RECEIVED &&
          payment.status !== PaymentStatus.RECEIVED_IN_CASH,
      ) || listPayments[0];

    return {
      payment: payment_data,
      billing_info,
      costumer,
      currentPayment: currentPayment.installmentNumber,
      installment_summary: installment_summary
        .map((installment) => ({
          dueDate: installment.dueDate,
          installmentNumber: installment.installmentNumber,
          value: installment.value,
          status: installment.status,
          currentInstallment: installment.id === payment_data.id,
        }))
        .reverse(),
    };
  }

  async updatePayment(id: string, data: UpdatePaymentDto): Promise<Payment> {
    const response = await this.httpService.axiosRef.put<Payment>(
      `/payments/${id}`,
      data,
    );
    return response.data;
  }

  async getPaymentsByCustomer(customer: string, page = 0): Promise<Payment[]> {
    const offset = page * this.LIMIT;
    const response =
      await this.httpService.axiosRef.get<AsaasListPaymentResponse>(
        '/payments',
        { params: { customer, limit: this.LIMIT, offset } },
      );
    return response.data.data;
  }

  async getBillingInfoByPayment(payment: string): Promise<BillingInfo> {
    try {
      const response = await this.httpService.axiosRef.get<BillingInfo>(
        `/payments/${payment}/billingInfo`,
      );
      return response.data;
    } catch {
      return null;
    }
  }

  async getStatusPaymentByExternalReference(
    external_reference: string,
  ): Promise<{ status: PaymentStatus }> {
    try {
      const data = await this.getPaymentsByExternalReference(
        external_reference,
      );

      const paymentPaid = data.installment_summary?.find(
        (installment) =>
          installment.status === PaymentStatus.CONFIRMED ||
          installment.status === PaymentStatus.RECEIVED ||
          installment.status === PaymentStatus.RECEIVED_IN_CASH,
      );

      if (paymentPaid) {
        return { status: paymentPaid.status };
      }

      return { status: data.payment.status };
    } catch {
      return { status: PaymentStatus.NOT_EXIST };
    }
  }

  async getPaymentById(id: string): Promise<Payment> {
    const response = await this.httpService.axiosRef.get<Payment>(
      `/payments/${id}`,
    );
    return response.data;
  }

  async payWithCreditCard(
    payment: string,
    data: {
      creditCardHolderInfo: CreditCardHolderInfo;
      creditCard: CreditCardCreatePayment;
      remoteIp?: string;
    },
  ): Promise<Payment> {
    const response = await this.httpService.axiosRef.post<Payment>(
      `/payments/${payment}/creditCardPayment`,
      {
        creditCardHolderInfo: data.creditCardHolderInfo,
        creditCard: data.creditCard,
        remoteIp: data.remoteIp,
      },
    );
    return response.data;
  }

  async deletePaymentsByExternalReference(
    external_reference: string,
  ): Promise<void> {
    const data = await this.getPaymentsByExternalReference(external_reference);

    const { payment } = data;

    const hasConfirmedOrReceived =
      data.installment_summary?.length > 0
        ? data.installment_summary.find(
          (installment) =>
            installment.status === PaymentStatus.CONFIRMED ||
            installment.status === PaymentStatus.RECEIVED ||
            installment.status === PaymentStatus.RECEIVED_IN_CASH,
        )
        : payment.status === PaymentStatus.CONFIRMED ||
        payment.status === PaymentStatus.RECEIVED ||
        payment.status === PaymentStatus.RECEIVED_IN_CASH;

    if (hasConfirmedOrReceived) {
      throw new ForbiddenException(
        'Não é possível cancelar um pagamento já confirmado ou recebido',
      );
    }

    if (payment.installment) {
      await this.deleteInstallment(payment.installment);
    } else {
      await this.httpService.axiosRef.delete(`/payments/${payment.id}`);
    }
  }

  async deleteInstallment(installment: string): Promise<void> {
    await this.httpService.axiosRef.delete(`/installments/${installment}`);
  }
}

import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsaasService } from 'src/services/asaas/asaas.service';
import { User } from 'src/controllers/user/user.entity';
import {
  CheckoutResponseDto,
  CreateCheckoutDto,
  PaymentStatus,
  PayWithCreditCardDto,
} from 'src/services/asaas/dto/payments.dto';
import {
  CreateCostumerDto,
  SyncCustomerDto,
} from 'src/services/asaas/dto/customers.dto';
import { AsaasCheckout } from './entity/asaas-checkout.entity';
import { AsaasWebhookPayload } from './interfaces/checkout.interfaces';
import { BankSlipService } from 'src/controllers/documents/bank-slip/bank-slip.service';
import { FinancialService } from 'src/controllers/financial/financial.service';

@Injectable()
export class AsaasCheckoutService {
  private readonly logger = new Logger(AsaasCheckoutService.name);

  constructor(
    @InjectRepository(AsaasCheckout)
    private readonly checkoutRepository: Repository<AsaasCheckout>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly asaasService: AsaasService,
    @Inject(forwardRef(() => BankSlipService))
    private readonly bankSlipService: BankSlipService,
    @Inject(forwardRef(() => FinancialService))
    private readonly financialService: FinancialService,
  ) {}

  async syncCustomer(
    userId: string,
    data?: SyncCustomerDto,
  ): Promise<{ asaas_id: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const cpfCnpj = data?.cpfCnpj || user.cpf;
    const name = data?.name || `${user.name} ${user.last_name}`.trim();
    const email = data?.email || user.username;

    if (!cpfCnpj) {
      throw new ForbiddenException('CPF/CNPJ é obrigatório para criar cliente no Asaas');
    }

    if (user.asaas_id) {
      await this.asaasService.updateCostumer(user.asaas_id, {
        cpfCnpj,
        name,
        email,
        phone: data?.phone || user.phone,
        mobilePhone: data?.mobilePhone || user.phone,
        postalCode: data?.postalCode,
        address: data?.address,
        addressNumber: data?.addressNumber,
      });

      return { asaas_id: user.asaas_id };
    }

    const customerData: CreateCostumerDto = {
      cpfCnpj,
      name,
      email,
      phone: data?.phone || user.phone,
      mobilePhone: data?.mobilePhone || user.phone,
      postalCode: data?.postalCode,
      address: data?.address,
      addressNumber: data?.addressNumber,
      externalReference: user.id,
    };

    const customer = await this.asaasService.createCostumer(customerData);

    await this.userRepository.update(user.id, { asaas_id: customer.id });

    return { asaas_id: customer.id };
  }

  async createCheckout(
    userId: string,
    data: CreateCheckoutDto,
  ): Promise<CheckoutResponseDto> {
    const { asaas_id } = await this.syncCustomer(userId);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    const checkout = await this.checkoutRepository.save({
      user_id: userId,
      asaas_customer_id: asaas_id,
      value: data.value,
      billing_type: data.billingType,
      description: data.description,
      reference_type: data.referenceType,
      reference_id: data.referenceId,
      status: PaymentStatus.PENDING,
    });

    try {
      const paymentAsaas = await this.asaasService.createPayment({
        billingType: data.billingType,
        customer: asaas_id,
        externalReference: checkout.id,
        value: data.value,
        description: data.description,
        dueDate: data.dueDate,
        installmentCount:
          data.installmentCount && data.installmentCount > 1
            ? data.installmentCount
            : undefined,
        creditCard: data.creditCard,
        creditCardHolderInfo: data.creditCardHolderInfo
          ? {
              ...data.creditCardHolderInfo,
              name:
                data.creditCardHolderInfo.name ||
                `${user.name} ${user.last_name}`.trim(),
              email: data.creditCardHolderInfo.email || user.username,
              phone: data.creditCardHolderInfo.phone || user.phone,
              mobilePhone:
                data.creditCardHolderInfo.mobilePhone || user.phone,
            }
          : undefined,
      });

      await this.checkoutRepository.update(checkout.id, {
        asaas_payment_id: paymentAsaas.payment.id,
        status: paymentAsaas.payment.status,
      });

      return {
        checkout_id: checkout.id,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        ...paymentAsaas,
      };
    } catch (error) {
      await this.checkoutRepository.delete(checkout.id);
      throw error;
    }
  }

  async getCheckout(
    checkoutId: string,
    userId: string,
    installmentNumber?: number,
  ): Promise<CheckoutResponseDto> {
    const checkout = await this.findCheckoutOrFail(checkoutId, userId);

    const paymentAsaas = await this.asaasService.getPaymentsByExternalReference(
      checkout.id,
      installmentNumber ?? null,
    );

    await this.updateCheckoutStatus(checkout.id, paymentAsaas.payment.status);

    return {
      checkout_id: checkout.id,
      referenceType: checkout.reference_type,
      referenceId: checkout.reference_id,
      ...paymentAsaas,
    };
  }

  async getCheckoutStatus(
    checkoutId: string,
    userId: string,
  ): Promise<{ status: PaymentStatus }> {
    await this.findCheckoutOrFail(checkoutId, userId);

    const status =
      await this.asaasService.getStatusPaymentByExternalReference(checkoutId);

    if (status.status !== PaymentStatus.NOT_EXIST) {
      await this.checkoutRepository.update(checkoutId, {
        status: status.status,
      });
    }

    return status;
  }

  async listCheckouts(userId: string): Promise<AsaasCheckout[]> {
    return this.checkoutRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async payWithCreditCard(
    checkoutId: string,
    userId: string,
    data: PayWithCreditCardDto,
    remoteIp?: string,
  ) {
    const checkout = await this.findCheckoutOrFail(checkoutId, userId);

    const paymentAsaas = await this.asaasService.getPaymentsByExternalReference(
      checkout.id,
    );

    const payment = await this.asaasService.payWithCreditCard(
      paymentAsaas.payment.id,
      {
        creditCard: data.creditCard,
        creditCardHolderInfo: data.creditCardHolderInfo,
        remoteIp,
      },
    );

    await this.checkoutRepository.update(checkout.id, {
      status: payment.status,
    });

    return payment;
  }

  async cancelCheckout(checkoutId: string, userId: string): Promise<void> {
    await this.findCheckoutOrFail(checkoutId, userId);

    await this.asaasService.deletePaymentsByExternalReference(checkoutId);

    await this.checkoutRepository.update(checkoutId, {
      status: PaymentStatus.REFUNDED,
    });
  }

  async refreshBillingInfo(checkoutId: string, userId: string) {
    const checkout = await this.findCheckoutOrFail(checkoutId, userId);

    if (!checkout.asaas_payment_id) {
      throw new NotFoundException('Pagamento Asaas não encontrado');
    }

    const billing_info = await this.asaasService.getBillingInfoByPayment(
      checkout.asaas_payment_id,
    );

    const payment = await this.asaasService.getPaymentById(
      checkout.asaas_payment_id,
    );

    return { billing_info, payment };
  }

  verifyIntegration() {
    return this.asaasService.verifyIntegration();
  }

  verifyWebhookConfig(receivedToken?: string) {
    const expectedToken = (process.env.ASAAS_WEBHOOK_TOKEN || '').trim();
    const configured = !!expectedToken;

    if (!configured) {
      return {
        success: false,
        configured: false,
        authenticated: false,
        message: 'ASAAS_WEBHOOK_TOKEN não está configurado no .env',
        hints: [
          'Defina ASAAS_WEBHOOK_TOKEN no .env com o mesmo valor do painel Asaas (Integrações > Webhooks > Token de autenticação)',
          'Reinicie a API após alterar o .env',
          'O Asaas envia o token no header asaas-access-token',
        ],
      };
    }

    if (!receivedToken) {
      return {
        success: true,
        configured: true,
        authenticated: false,
        message:
          'Token configurado. Envie o header asaas-access-token para validar a autenticação.',
        tokenPreview: `${expectedToken.substring(0, 6)}...`,
        endpoint: 'POST /asaas/webhook',
        header: 'asaas-access-token',
      };
    }

    const authenticated = receivedToken.trim() === expectedToken;

    return {
      success: authenticated,
      configured: true,
      authenticated,
      message: authenticated
        ? 'Webhook autenticado com sucesso. Conexão pronta para receber eventos do Asaas.'
        : 'Token enviado não confere com ASAAS_WEBHOOK_TOKEN',
      tokenPreview: `${expectedToken.substring(0, 6)}...`,
      hints: authenticated
        ? undefined
        : [
            'Confira se o token do .env é idêntico ao cadastrado no painel Asaas',
            'Header esperado: asaas-access-token',
          ],
    };
  }

  async handleWebhook(payload: AsaasWebhookPayload): Promise<void> {
    const externalReference = payload.payment?.externalReference;

    if (!externalReference) {
      this.logger.warn('Webhook Asaas sem externalReference');
      return;
    }

    const checkout = await this.checkoutRepository.findOne({
      where: { id: externalReference.replace(/:entry$/, '') },
    });

    if (checkout) {
      await this.checkoutRepository.update(checkout.id, {
        status: payload.payment.status,
        asaas_payment_id: payload.payment.id,
      });

      this.logger.log(
        `Checkout ${checkout.id} atualizado via webhook: ${payload.event} -> ${payload.payment.status}`,
      );
    }

    await this.bankSlipService.handleWebhook(payload);
    await this.financialService.handleRevenueWebhook(payload);
  }

  private async findCheckoutOrFail(
    checkoutId: string,
    userId: string,
  ): Promise<AsaasCheckout> {
    const checkout = await this.checkoutRepository.findOne({
      where: { id: checkoutId, user_id: userId },
    });

    if (!checkout) {
      throw new NotFoundException('Checkout não encontrado');
    }

    return checkout;
  }

  private async updateCheckoutStatus(
    checkoutId: string,
    status: PaymentStatus,
  ): Promise<void> {
    await this.checkoutRepository.update(checkoutId, { status });
  }
}

/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { addMonths, format, setDate, isBefore } from 'date-fns';
import { BankSlip, BankSlipInstallment } from './bank-slip.entity';
import { FilterDocumentsDto } from '../documents.dto';
import { AsaasService } from 'src/services/asaas/asaas.service';
import {
  BillingType,
  PaymentStatus,
} from 'src/services/asaas/dto/payments.dto';
import { AsaasWebhookPayload } from 'src/controllers/asaas/interfaces/checkout.interfaces';
import { Transaction } from 'src/controllers/financial/entity/transaction.entity';
import { InstallmentStatus } from 'src/controllers/financial/entity/installment.entity';

@Injectable()
export class BankSlipService {
  private readonly logger = new Logger(BankSlipService.name);

  constructor(
    @InjectRepository(BankSlip)
    private readonly ticketRepository: Repository<BankSlip>,
    private readonly asaasService: AsaasService,
  ) {}

  private parseMoney(value: any): number {
    if (typeof value === 'number') {
      return value;
    }
    const normalized = String(value || '0')
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.-]/g, '');
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private cleanDocument(value: string): string {
    return String(value || '').replace(/\D/g, '');
  }

  private cleanPhone(value: string): string {
    return String(value || '').replace(/\D/g, '');
  }

  private mapAsaasStatusToBankSlip(status: PaymentStatus | string): string {
    switch (status) {
      case PaymentStatus.RECEIVED:
      case PaymentStatus.CONFIRMED:
      case PaymentStatus.RECEIVED_IN_CASH:
        return 'Pago';
      case PaymentStatus.OVERDUE:
        return 'Atrasado';
      case PaymentStatus.REFUNDED:
      case 'DELETED':
        return 'Cancelado';
      case PaymentStatus.PENDING:
      default:
        return 'Vigente';
    }
  }

  private buildInstallments(
    totalValue: number,
    entryValue: number,
    installmentCount: number,
    dueDateDay?: number,
    existing?: BankSlipInstallment[] | null,
  ): BankSlipInstallment[] {
    const parcelTotal = Math.max(totalValue - entryValue, 0);
    const count = Math.max(installmentCount, 1);
    const baseValue = Number((parcelTotal / count).toFixed(2));
    const day = dueDateDay || new Date().getDate();

    return Array.from({ length: count }, (_, index) => {
      const fromExisting = existing?.[index];
      let dueDate: Date;

      if (fromExisting?.due_date) {
        dueDate = new Date(fromExisting.due_date);
      } else {
        dueDate = setDate(addMonths(new Date(), index + 1), day);
        if (isBefore(dueDate, new Date())) {
          dueDate = addMonths(dueDate, 1);
        }
      }

      const isLast = index === count - 1;
      const value = isLast
        ? Number((parcelTotal - baseValue * (count - 1)).toFixed(2))
        : baseValue;

      return {
        parcel: index + 1,
        value,
        due_date: dueDate,
        status: 'Vigente',
      };
    });
  }

  async create(body: any): Promise<any> {
    const payment = body.payment === true || body.payment === 'true';
    let installments: BankSlipInstallment[] | null = body.installments || null;
    const totalValue = this.parseMoney(body.value);
    const entryValue = this.parseMoney(body.entry_value || 0);

    if (entryValue < 0) {
      throw new HttpException(
        'Valor de entrada não pode ser negativo',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (entryValue > totalValue) {
      throw new HttpException(
        'Valor de entrada não pode ser maior que o valor total',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payment) {
      installments = null;
    } else {
      const count =
        Array.isArray(installments) && installments.length > 0
          ? installments.length
          : 0;

      if (count < 1) {
        throw new HttpException(
          'Pagamento parcelado tem que ter no mínimo 1 parcela.',
          HttpStatus.BAD_REQUEST,
        );
      }

      installments = this.buildInstallments(
        totalValue,
        entryValue,
        count,
        undefined,
        installments,
      );
    }

    const cpfCnpj = this.cleanDocument(body.CPF);
    if (!cpfCnpj) {
      throw new HttpException('CPF/CNPJ é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const customer = await this.asaasService.getOrCreateCostumer({
      cpfCnpj,
      name: body.provider,
      email: body.email,
      phone: this.cleanPhone(body.phone),
      mobilePhone: this.cleanPhone(body.phone),
      address: body.address,
    });

    const bankSlip = await this.ticketRepository.save({
      property: body.property,
      provider: body.provider,
      value: totalValue,
      entry_value: entryValue,
      payment,
      installments,
      status: body.status || 'Vigente',
      CPF: body.CPF,
      address: body.address,
      email: body.email,
      phone: body.phone,
      description: body.description || null,
      date: body.date ? new Date(body.date) : new Date(),
      asaas_customer_id: customer.id,
      checkout_id: null,
    });

    bankSlip.checkout_id = bankSlip.ticket_number;

    try {
      const asaasData = await this.registerOnAsaas(bankSlip, customer.id);
      await this.ticketRepository.update(bankSlip.ticket_number, asaasData);
      return this.findByNumber(bankSlip.ticket_number);
    } catch (error) {
      this.logger.error(
        'Erro ao registrar boleto no Asaas',
        error?.response?.data || error.message,
      );
      await this.ticketRepository.delete(bankSlip.ticket_number);
      throw new HttpException(
        error?.response?.data?.errors?.[0]?.description ||
          'Erro ao gerar boleto no Asaas',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async registerOnAsaas(
    bankSlip: BankSlip,
    customerId: string,
  ): Promise<Partial<BankSlip>> {
    const description =
      bankSlip.description || `Boleto ${bankSlip.provider} - Stribo`;

    if (bankSlip.payment) {
      const dueDate = format(
        bankSlip.date ? new Date(bankSlip.date) : addMonths(new Date(), 0),
        'yyyy-MM-dd',
      );

      const paymentAsaas = await this.asaasService.createPayment({
        customer: customerId,
        billingType: BillingType.BOLETO,
        value: Number(bankSlip.value),
        externalReference: bankSlip.ticket_number,
        description,
        dueDate,
      });

      return {
        checkout_id: bankSlip.ticket_number,
        asaas_payment_id: paymentAsaas.payment.id,
        asaas_status: paymentAsaas.payment.status,
        bank_slip_url:
          paymentAsaas.billing_info?.bankSlip?.bankSlipUrl ||
          paymentAsaas.payment.bankSlipUrl,
        bar_code: paymentAsaas.billing_info?.bankSlip?.barCode || null,
        identification_field:
          paymentAsaas.billing_info?.bankSlip?.identificationField || null,
        status: this.mapAsaasStatusToBankSlip(paymentAsaas.payment.status),
      };
    }

    const entryValue = Number(bankSlip.entry_value || 0);
    const installments = bankSlip.installments || [];
    const parcelTotal = Math.max(Number(bankSlip.value) - entryValue, 0);
    let asaasEntryPaymentId: string = null;

    if (entryValue > 0) {
      const entryPayment = await this.asaasService.createPayment({
        customer: customerId,
        billingType: BillingType.BOLETO,
        value: entryValue,
        externalReference: `${bankSlip.ticket_number}:entry`,
        description: `${description} - Entrada`,
        dueDate: format(new Date(), 'yyyy-MM-dd'),
      });
      asaasEntryPaymentId = entryPayment.payment.id;
    }

    const firstDue = installments[0]?.due_date
      ? format(new Date(installments[0].due_date), 'yyyy-MM-dd')
      : format(addMonths(new Date(), 1), 'yyyy-MM-dd');

    const installmentPayment = await this.asaasService.createPayment({
      customer: customerId,
      billingType: BillingType.BOLETO,
      value: parcelTotal,
      totalValue: parcelTotal,
      installmentCount: installments.length,
      externalReference: bankSlip.ticket_number,
      description: `${description} - Parcelado`,
      dueDate: firstDue,
    });

    const enrichedInstallments: BankSlipInstallment[] = [];

    if (installmentPayment.payment.installment) {
      const asaasInstallments =
        await this.asaasService.getPaymentsByInstallment(
          installmentPayment.payment.installment,
        );

      for (const local of installments) {
        const remote = asaasInstallments.find(
          (item) => item.installmentNumber === local.parcel,
        );

        let bankSlipUrl = remote?.bankSlipUrl;
        let barCode: string = null;
        let identificationField: string = null;

        if (remote?.id) {
          const billing = await this.asaasService.getBillingInfoByPayment(
            remote.id,
          );
          bankSlipUrl = billing?.bankSlip?.bankSlipUrl || bankSlipUrl;
          barCode = billing?.bankSlip?.barCode || null;
          identificationField = billing?.bankSlip?.identificationField || null;
        }

        enrichedInstallments.push({
          ...local,
          value: remote?.value ?? local.value,
          due_date: remote?.dueDate || local.due_date,
          status: this.mapAsaasStatusToBankSlip(
            remote?.status || PaymentStatus.PENDING,
          ),
          asaas_payment_id: remote?.id,
          bank_slip_url: bankSlipUrl,
          bar_code: barCode,
          identification_field: identificationField,
        });
      }
    } else {
      for (const local of installments) {
        enrichedInstallments.push({ ...local, status: 'Vigente' });
      }
    }

    const firstInstallment = enrichedInstallments[0];

    return {
      checkout_id: bankSlip.ticket_number,
      asaas_payment_id: installmentPayment.payment.id,
      asaas_installment_id: installmentPayment.payment.installment || null,
      asaas_entry_payment_id: asaasEntryPaymentId,
      asaas_status: installmentPayment.payment.status,
      bank_slip_url:
        firstInstallment?.bank_slip_url ||
        installmentPayment.billing_info?.bankSlip?.bankSlipUrl ||
        installmentPayment.payment.bankSlipUrl,
      bar_code:
        firstInstallment?.bar_code ||
        installmentPayment.billing_info?.bankSlip?.barCode ||
        null,
      identification_field:
        firstInstallment?.identification_field ||
        installmentPayment.billing_info?.bankSlip?.identificationField ||
        null,
      installments: enrichedInstallments,
      status: this.mapAsaasStatusToBankSlip(installmentPayment.payment.status),
    };
  }

  async createFromTransaction(transaction: Transaction): Promise<BankSlip> {
    const existing = await this.ticketRepository.findOne({
      where: { checkout_id: transaction.id },
    });

    if (existing) {
      return existing;
    }

    const valueReais = Number(
      (Number(transaction.original_value || 0) / 100).toFixed(2),
    );
    const entryValueReais = Number(
      (Number(transaction.entry_value || 0) / 100).toFixed(2),
    );

    const installments = [...(transaction.installments || [])].sort(
      (a, b) => (a.parcel || 0) - (b.parcel || 0),
    );

    const isSinglePayment =
      installments.length <= 1 && entryValueReais === 0 && !transaction.asaas_installment_id;

    const bankSlipInstallments: BankSlipInstallment[] | null = isSinglePayment
      ? null
      : installments.map((item, index) => ({
          parcel: item.parcel || index + 1,
          value: Number((Number(item.value || 0) / 100).toFixed(2)),
          due_date: item.due_date,
          status:
            item.status === InstallmentStatus.PAID
              ? 'Pago'
              : item.status === InstallmentStatus.OVERDUE
                ? 'Atrasado'
                : this.mapAsaasStatusToBankSlip(
                    item.asaas_status || PaymentStatus.PENDING,
                  ),
          asaas_payment_id: item.asaas_payment_id || undefined,
          bank_slip_url: item.bank_slip_url || undefined,
          bar_code: item.bar_code || undefined,
          identification_field: item.identification_field || undefined,
        }));

    const bankSlip = await this.ticketRepository.save({
      property: transaction.property_id,
      provider:
        transaction.beneficiary_name ||
        transaction.description ||
        'Cliente Stribo',
      value: valueReais,
      entry_value: entryValueReais,
      payment: isSinglePayment,
      installments: bankSlipInstallments,
      status: this.mapAsaasStatusToBankSlip(
        transaction.asaas_status || PaymentStatus.PENDING,
      ),
      CPF: transaction.payer_cpf || '',
      address: transaction.payer_address || '',
      email: transaction.payer_email || '',
      phone: transaction.payer_phone || '',
      description: transaction.description || null,
      asaas_customer_id: transaction.asaas_customer_id,
      asaas_payment_id: transaction.asaas_payment_id,
      asaas_installment_id: transaction.asaas_installment_id,
      asaas_entry_payment_id: transaction.asaas_entry_payment_id,
      checkout_id: transaction.id,
      bank_slip_url: transaction.bank_slip_url,
      bar_code: transaction.bar_code,
      identification_field: transaction.identification_field,
      asaas_status: transaction.asaas_status,
      date: transaction.datetime ? new Date(transaction.datetime) : new Date(),
    });

    this.logger.log(
      `Bank slip ${bankSlip.ticket_number} criado a partir da transação ${transaction.id}`,
    );

    return bankSlip;
  }

  async handleWebhook(payload: AsaasWebhookPayload): Promise<void> {
    const payment = payload.payment;
    if (!payment?.externalReference) {
      this.logger.warn('Webhook bank-slip sem externalReference');
      return;
    }

    const externalReference = payment.externalReference;
    const isEntry = externalReference.endsWith(':entry');
    const referenceId = isEntry
      ? externalReference.replace(/:entry$/, '')
      : externalReference;

    let bankSlip =
      (await this.findByNumber(referenceId)) ||
      (await this.ticketRepository.findOne({
        where: { checkout_id: referenceId },
      }));

    if (!bankSlip && payment.id) {
      bankSlip = await this.ticketRepository.findOne({
        where: [
          { asaas_payment_id: payment.id },
          { asaas_entry_payment_id: payment.id },
        ],
      });
    }

    if (!bankSlip) {
      this.logger.warn(`Bank slip não encontrado: ${referenceId}`);
      return;
    }

    const mappedStatus = this.mapAsaasStatusToBankSlip(payment.status);
    const update: Partial<BankSlip> = {
      asaas_status: payment.status,
    };

    if (isEntry) {
      update.asaas_entry_payment_id = payment.id;
      if (mappedStatus === 'Pago' && bankSlip.payment === false) {
        // entrada paga: não altera status geral se ainda há parcelas
      } else if (mappedStatus === 'Pago' && bankSlip.payment === true) {
        update.status = 'Pago';
      }
    } else if (bankSlip.payment) {
      update.asaas_payment_id = payment.id;
      update.status = mappedStatus;
      if (payment.bankSlipUrl) {
        update.bank_slip_url = payment.bankSlipUrl;
      }
    } else {
      const installments = [...(bankSlip.installments || [])];
      const index = installments.findIndex(
        (item) =>
          item.asaas_payment_id === payment.id ||
          item.parcel === payment.installmentNumber,
      );

      if (index >= 0) {
        installments[index] = {
          ...installments[index],
          status: mappedStatus,
          asaas_payment_id: payment.id,
          bank_slip_url:
            payment.bankSlipUrl || installments[index].bank_slip_url,
        };
        update.installments = installments;
      }

      const allPaid =
        installments.length > 0 &&
        installments.every((item) => item.status === 'Pago');
      const anyOverdue = installments.some((item) => item.status === 'Atrasado');

      if (allPaid) {
        update.status = 'Pago';
      } else if (anyOverdue) {
        update.status = 'Atrasado';
      } else {
        update.status = 'Vigente';
      }

      if (payment.bankSlipUrl && !update.bank_slip_url) {
        update.bank_slip_url = payment.bankSlipUrl;
      }
    }

    await this.ticketRepository.update(bankSlip.ticket_number, update);
    this.logger.log(
      `Bank slip ${bankSlip.ticket_number} atualizado via webhook: ${payload.event} -> ${payment.status}`,
    );
  }

  async findByNumber(ticket_number: string): Promise<any> {
    return await this.ticketRepository.findOne({ where: { ticket_number } });
  }

  async findByProperty(property: string): Promise<any> {
    return this.ticketRepository.find({ where: { property } });
  }

  async findAll(): Promise<any> {
    return this.ticketRepository.find();
  }

  async update(ticket_number: string, body: any): Promise<any> {
    const verify = await this.findByNumber(ticket_number);

    if (!verify) {
      throw new HttpException('Boleto não encontrado', HttpStatus.BAD_REQUEST);
    }

    const { payment, installments } = body;

    if (payment && installments !== null) {
      body.installments = null;
    }

    if (!payment && (installments === null || installments.length < 1)) {
      throw new HttpException(
        'Pagamento parcelado tem que ter no mínimo 1 parcela.',
        HttpStatus.BAD_REQUEST,
      );
    }

    body.ticket_number = verify.ticket_number;
    body.property = verify.property;

    await this.ticketRepository.update(ticket_number, body);
    return this.findByNumber(ticket_number);
  }

  async findFiltered(
    body: FilterDocumentsDto,
    property: string,
  ): Promise<any[]> {
    const queryBuilder = this.ticketRepository.createQueryBuilder('bank-slip');

    if (body.initialDate) {
      queryBuilder.andWhere('bank-slip.date >= :initialDate', {
        initialDate: body.initialDate,
      });
    }

    if (body.lastDate) {
      queryBuilder.andWhere('bank-slip.date <= :lastDate', {
        lastDate: body.lastDate,
      });
    }

    if (property) {
      queryBuilder.andWhere('bank-slip.property = :property', {
        property: property,
      });
    }

    if (body.provider) {
      queryBuilder.andWhere('bank-slip.provider = :provider', {
        provider: body.provider,
      });
    }

    if (
      body.order &&
      (body.order.toUpperCase() === 'ASC' ||
        body.order.toUpperCase() === 'DESC')
    ) {
      queryBuilder.addOrderBy('bank-slip.date', body.order as 'ASC' | 'DESC');
    }

    return queryBuilder.getMany();
  }

  async delete(ticket_number: string): Promise<void> {
    await this.ticketRepository.delete(ticket_number);
  }
}

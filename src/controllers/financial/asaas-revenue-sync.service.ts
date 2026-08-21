import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { format } from 'date-fns';
import { AsaasService } from 'src/services/asaas/asaas.service';
import {
  Payment,
  PaymentStatus,
} from 'src/services/asaas/dto/payments.dto';
import { Costumer } from 'src/services/asaas/dto/customers.dto';
import { AsaasWebhookPayload } from 'src/controllers/asaas/interfaces/checkout.interfaces';
import {
  Transaction,
  TransactionImportSource,
  TransactionType,
} from './entity/transaction.entity';
import { Installment, InstallmentStatus } from './entity/installment.entity';
import { BankAccount } from './entity/bank-account.entity';
import { Category, CategoryType } from './entity/category.entity';
import { Provider } from '../provider/provider.entity';

const VALUE_TOLERANCE_CENTS = 2;
const DATE_TOLERANCE_DAYS = 3;

@Injectable()
export class AsaasRevenueSyncService {
  private readonly logger = new Logger(AsaasRevenueSyncService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Installment)
    private readonly installmentRepository: Repository<Installment>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly asaasService: AsaasService,
  ) {}

  private cleanDocument(value: string): string {
    return String(value || '').replace(/\D/g, '');
  }

  private paymentValueToCents(value: number): number {
    return Math.round(Number(value || 0) * 100);
  }

  private datesWithinDays(
    left: Date | string,
    right: Date | string,
    days = DATE_TOLERANCE_DAYS,
  ): boolean {
    const a = new Date(left);
    const b = new Date(right);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
      return false;
    }
    const diffMs = Math.abs(a.getTime() - b.getTime());
    return diffMs <= days * 24 * 60 * 60 * 1000;
  }

  private valuesMatchCents(localCents: number, paymentValueReais: number): boolean {
    return (
      Math.abs(Number(localCents) - this.paymentValueToCents(paymentValueReais)) <=
      VALUE_TOLERANCE_CENTS
    );
  }

  mapAsaasToInstallmentStatus(status: PaymentStatus | string): InstallmentStatus {
    switch (status) {
      case PaymentStatus.RECEIVED:
      case PaymentStatus.CONFIRMED:
      case PaymentStatus.RECEIVED_IN_CASH:
        return InstallmentStatus.PAID;
      case PaymentStatus.OVERDUE:
        return InstallmentStatus.OVERDUE;
      default:
        return InstallmentStatus.PENDING;
    }
  }

  async findTransactionByAsaasPaymentId(
    paymentId: string,
  ): Promise<Transaction | null> {
    if (!paymentId) {
      return null;
    }

    const byTransaction = await this.transactionRepository.findOne({
      where: [
        { asaas_payment_id: paymentId },
        { asaas_entry_payment_id: paymentId },
      ],
      relations: { installments: true },
    });

    if (byTransaction) {
      return byTransaction;
    }

    const installment = await this.installmentRepository.findOne({
      where: { asaas_payment_id: paymentId },
      relations: { transaction: { installments: true } },
    });

    return installment?.transaction || null;
  }

  async findMatchingTransactionForPayment(
    payment: Payment,
    propertyId?: string,
    customerCpf?: string,
  ): Promise<Transaction | null> {
    const alreadyLinked = await this.findTransactionByAsaasPaymentId(payment.id);
    if (alreadyLinked) {
      return alreadyLinked;
    }

    const qb = this.transactionRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.installments', 'i')
      .where('t.type = :type', { type: TransactionType.REVENUE })
      .andWhere('(t.asaas_payment_id IS NULL OR t.asaas_payment_id = \'\')')
      .andWhere('(t.checkout_id IS NULL OR t.checkout_id = \'\')')
      .andWhere(
        '(t.import_source IS NULL OR t.import_source != :ofxSource)',
        { ofxSource: TransactionImportSource.OFX },
      );

    if (propertyId) {
      qb.andWhere('t.property_id = :propertyId', { propertyId });
    }

    const candidates = await qb.getMany();
    const cleanedCpf = customerCpf ? this.cleanDocument(customerCpf) : null;

    const matches = candidates.filter((transaction) => {
      if (cleanedCpf && transaction.payer_cpf) {
        if (this.cleanDocument(transaction.payer_cpf) !== cleanedCpf) {
          return false;
        }
      }

      return this.transactionMatchesPayment(transaction, payment);
    });

    if (matches.length === 1) {
      return matches[0];
    }

    if (matches.length > 1) {
      this.logger.warn(
        `Match ambíguo para pagamento Asaas ${payment.id}: ${matches.length} candidatos`,
      );
    }

    return null;
  }

  /**
   * Extrato OFX registra caixa (pago/recebido), não cobrança Asaas.
   * Se o crédito já foi importado via OFX, não auto-criamos receita Asaas duplicada.
   */
  async findOfxImportForPayment(
    payment: Payment,
    propertyId?: string,
  ): Promise<Transaction | null> {
    if (!propertyId) {
      return null;
    }

    const paymentValueCents = this.paymentValueToCents(payment.value);
    const referenceDate = payment.paymentDate
      ? new Date(payment.paymentDate)
      : payment.dueDate
        ? new Date(payment.dueDate)
        : null;

    const candidates = await this.transactionRepository.find({
      where: {
        property_id: propertyId,
        type: TransactionType.REVENUE,
        import_source: TransactionImportSource.OFX,
      },
    });

    const matches = candidates.filter((transaction) => {
      if (!this.valuesMatchCents(Number(transaction.original_value), payment.value)) {
        return false;
      }

      if (!referenceDate) {
        return true;
      }

      return this.datesWithinDays(transaction.datetime, referenceDate);
    });

    if (matches.length === 1) {
      return matches[0];
    }

    if (matches.length > 1) {
      this.logger.warn(
        `Múltiplos lançamentos OFX compatíveis com pagamento Asaas ${payment.id}`,
      );
    }

    return null;
  }

  private transactionMatchesPayment(
    transaction: Transaction,
    payment: Payment,
  ): boolean {
    const installments = [...(transaction.installments || [])].sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    );

    if (installments.length === 0) {
      return false;
    }

    const dueDate = payment.dueDate ? new Date(payment.dueDate) : null;

    if (payment.installmentNumber && installments.length > 1) {
      const installment =
        installments.find((item) => item.parcel === payment.installmentNumber) ||
        installments[payment.installmentNumber - 1];

      if (!installment) {
        return false;
      }

      return (
        this.valuesMatchCents(Number(installment.value), payment.value) &&
        (!dueDate || this.datesWithinDays(installment.due_date, dueDate))
      );
    }

    return installments.some(
      (installment) =>
        this.valuesMatchCents(Number(installment.value), payment.value) &&
        (!dueDate || this.datesWithinDays(installment.due_date, dueDate)),
    );
  }

  async findExistingAsaasPaymentsForTransaction(
    transaction: Transaction,
    customerId: string,
    installments: Installment[],
    entryValueCents: number,
  ): Promise<{ single?: Payment; installment?: Payment; entry?: Payment }> {
    const remotePayments = await this.asaasService.getPaymentsByCustomer(
      customerId,
    );
    const result: {
      single?: Payment;
      installment?: Payment;
      entry?: Payment;
    } = {};

    const isSinglePayment =
      installments.length === 1 && entryValueCents === 0;

    if (isSinglePayment) {
      const dueDate = format(new Date(installments[0].due_date), 'yyyy-MM-dd');
      const totalValueCents = Number(transaction.original_value);

      for (const remote of remotePayments) {
        if (remote.deleted || remote.installment) {
          continue;
        }

        if (!(await this.isPaymentAvailableForLink(remote, transaction.id))) {
          continue;
        }

        if (
          this.valuesMatchCents(totalValueCents, remote.value) &&
          remote.dueDate === dueDate
        ) {
          result.single = remote;
          return result;
        }
      }

      return result;
    }

    const firstDue = format(new Date(installments[0].due_date), 'yyyy-MM-dd');
    const parcelTotalCents = Math.max(
      Number(transaction.original_value) - entryValueCents,
      0,
    );

    for (const remote of remotePayments) {
      if (remote.deleted || !remote.installment) {
        continue;
      }

      if (!(await this.isPaymentAvailableForLink(remote, transaction.id))) {
        continue;
      }

      if (remote.installmentNumber !== 1 || remote.dueDate !== firstDue) {
        continue;
      }

      const remoteInstallments = await this.asaasService.getPaymentsByInstallment(
        remote.installment,
      );

      if (remoteInstallments.length !== installments.length) {
        continue;
      }

      const remoteTotalCents = remoteInstallments.reduce(
        (sum, item) => sum + this.paymentValueToCents(item.value),
        0,
      );

      if (
        Math.abs(remoteTotalCents - parcelTotalCents) <=
        VALUE_TOLERANCE_CENTS * installments.length
      ) {
        result.installment = remote;
        break;
      }
    }

    if (entryValueCents > 0) {
      for (const remote of remotePayments) {
        if (remote.deleted) {
          continue;
        }

        if (
          !(await this.isPaymentAvailableForLink(
            remote,
            `${transaction.id}:entry`,
          ))
        ) {
          continue;
        }

        if (this.valuesMatchCents(entryValueCents, remote.value)) {
          result.entry = remote;
          break;
        }
      }
    }

    return result;
  }

  private async isPaymentAvailableForLink(
    payment: Payment,
    expectedReference: string,
  ): Promise<boolean> {
    if (
      payment.externalReference &&
      payment.externalReference !== expectedReference
    ) {
      const linked = await this.findTransactionByAsaasPaymentId(payment.id);
      if (linked) {
        return false;
      }
    }

    const linked = await this.findTransactionByAsaasPaymentId(payment.id);
    if (linked) {
      return false;
    }

    return true;
  }

  async syncAsaasExternalReference(
    payment: Payment,
    transactionId: string,
    isEntry = false,
  ): Promise<void> {
    const expectedReference = isEntry
      ? `${transactionId}:entry`
      : transactionId;

    if (payment.externalReference === expectedReference) {
      return;
    }

    try {
      await this.asaasService.updatePayment(payment.id, {
        externalReference: expectedReference,
      });
    } catch (error) {
      this.logger.warn(
        `Não foi possível atualizar externalReference do pagamento ${payment.id}`,
        error?.response?.data || error?.message,
      );
    }
  }

  async linkTransactionToAsaasPayment(
    transaction: Transaction,
    payment: Payment,
    options: {
      isEntry?: boolean;
      customer?: Costumer;
      payerFields?: Partial<Transaction>;
      syncExternalReference?: boolean;
    } = {},
  ): Promise<Transaction> {
    const isEntry = options.isEntry ?? false;
    const installments = [...(transaction.installments || [])].sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    );

    let bankSlipUrl = payment.bankSlipUrl || null;
    let barCode: string = null;
    let identificationField: string = null;

    if (payment.id && !bankSlipUrl) {
      const billing = await this.asaasService.getBillingInfoByPayment(
        payment.id,
      );
      bankSlipUrl = billing?.bankSlip?.bankSlipUrl || bankSlipUrl;
      barCode = billing?.bankSlip?.barCode || null;
      identificationField = billing?.bankSlip?.identificationField || null;
    }

    const baseUpdate: Partial<Transaction> = {
      checkout_id: transaction.checkout_id || transaction.id,
      asaas_customer_id: payment.customer || transaction.asaas_customer_id,
      asaas_status: payment.status,
      ...(options.payerFields || {}),
    };

    if (isEntry) {
      await this.transactionRepository.update(transaction.id, {
        ...baseUpdate,
        asaas_entry_payment_id: payment.id,
      });

      if (options.syncExternalReference !== false) {
        await this.syncAsaasExternalReference(
          payment,
          transaction.id,
          true,
        );
      }

      return this.reloadTransaction(transaction.id);
    }

    const isSingle =
      installments.length === 1 && !payment.installment;

    if (isSingle) {
      await this.transactionRepository.update(transaction.id, {
        ...baseUpdate,
        asaas_payment_id: payment.id,
        bank_slip_url: bankSlipUrl,
        bar_code: barCode,
        identification_field: identificationField,
      });

      if (installments[0]) {
        await this.installmentRepository.update(installments[0].id, {
          parcel: 1,
          asaas_payment_id: payment.id,
          asaas_status: payment.status,
          bank_slip_url: bankSlipUrl,
          bar_code: barCode,
          identification_field: identificationField,
          status: this.mapAsaasToInstallmentStatus(payment.status),
        });
      }
    } else if (payment.installment) {
      const asaasInstallments =
        await this.asaasService.getPaymentsByInstallment(payment.installment);

      await this.transactionRepository.update(transaction.id, {
        ...baseUpdate,
        asaas_installment_id: payment.installment,
        asaas_payment_id: payment.id,
        bank_slip_url: bankSlipUrl || transaction.bank_slip_url,
        bar_code: barCode || transaction.bar_code,
        identification_field:
          identificationField || transaction.identification_field,
      });

      for (let i = 0; i < installments.length; i++) {
        const local = installments[i];
        const remote =
          asaasInstallments.find(
            (item) => item.installmentNumber === i + 1,
          ) ||
          asaasInstallments.find((item) => item.id === payment.id);

        if (!remote) {
          continue;
        }

        let instBankSlipUrl = remote.bankSlipUrl;
        let instBarCode: string = null;
        let instIdentificationField: string = null;

        if (remote.id) {
          const billing = await this.asaasService.getBillingInfoByPayment(
            remote.id,
          );
          instBankSlipUrl = billing?.bankSlip?.bankSlipUrl || instBankSlipUrl;
          instBarCode = billing?.bankSlip?.barCode || null;
          instIdentificationField =
            billing?.bankSlip?.identificationField || null;
        }

        await this.installmentRepository.update(local.id, {
          parcel: i + 1,
          asaas_payment_id: remote.id,
          asaas_status: remote.status,
          bank_slip_url: instBankSlipUrl,
          bar_code: instBarCode,
          identification_field: instIdentificationField,
          status: this.mapAsaasToInstallmentStatus(remote.status),
        });
      }
    } else {
      await this.transactionRepository.update(transaction.id, {
        ...baseUpdate,
        asaas_payment_id: payment.id,
        bank_slip_url: bankSlipUrl,
        bar_code: barCode,
        identification_field: identificationField,
      });

      const index = installments.findIndex(
        (item) =>
          item.asaas_payment_id === payment.id ||
          item.parcel === payment.installmentNumber,
      );

      if (index >= 0) {
        await this.installmentRepository.update(installments[index].id, {
          asaas_payment_id: payment.id,
          asaas_status: payment.status,
          bank_slip_url: bankSlipUrl,
          status: this.mapAsaasToInstallmentStatus(payment.status),
        });
      }
    }

    if (options.syncExternalReference !== false) {
      await this.syncAsaasExternalReference(payment, transaction.id, false);
    }

    return this.reloadTransaction(transaction.id);
  }

  async applyPaymentUpdateToTransaction(
    transaction: Transaction,
    payment: Payment,
    isEntry: boolean,
    event: string,
  ): Promise<void> {
    const installmentStatus = this.mapAsaasToInstallmentStatus(payment.status);
    const update: Partial<Transaction> = {
      asaas_status: payment.status,
    };

    if (isEntry) {
      update.asaas_entry_payment_id = payment.id;
      await this.transactionRepository.update(transaction.id, update);
      this.logger.log(
        `Entrada da transação ${transaction.id} atualizada via webhook: ${event} -> ${payment.status}`,
      );
      return;
    }

    const installments = [...(transaction.installments || [])].sort(
      (a, b) => (a.parcel || 0) - (b.parcel || 0),
    );
    const isSingle =
      installments.length === 1 && !transaction.asaas_installment_id;

    if (isSingle) {
      update.asaas_payment_id = payment.id;
      if (payment.bankSlipUrl) {
        update.bank_slip_url = payment.bankSlipUrl;
      }

      await this.transactionRepository.update(transaction.id, update);

      if (installments[0]) {
        await this.installmentRepository.update(installments[0].id, {
          asaas_payment_id: payment.id,
          asaas_status: payment.status,
          bank_slip_url: payment.bankSlipUrl || installments[0].bank_slip_url,
          status: installmentStatus,
        });
      }

      this.logger.log(
        `Transação ${transaction.id} atualizada via webhook: ${event} -> ${payment.status}`,
      );
      return;
    }

    const index = installments.findIndex(
      (item) =>
        item.asaas_payment_id === payment.id ||
        item.parcel === payment.installmentNumber,
    );

    if (index >= 0) {
      const inst = installments[index];
      await this.installmentRepository.update(inst.id, {
        asaas_payment_id: payment.id,
        asaas_status: payment.status,
        bank_slip_url: payment.bankSlipUrl || inst.bank_slip_url,
        status: installmentStatus,
      });
    }

    update.asaas_payment_id = payment.id;
    if (payment.bankSlipUrl) {
      update.bank_slip_url = payment.bankSlipUrl;
    }

    await this.transactionRepository.update(transaction.id, update);
    this.logger.log(
      `Parcela da transação ${transaction.id} atualizada via webhook: ${event} -> ${payment.status}`,
    );
  }

  async resolvePropertyIdFromAsaasCustomer(
    customer: Costumer,
  ): Promise<string | null> {
    if (customer.externalReference) {
      const bankAccount = await this.bankAccountRepository.findOne({
        where: { property_id: customer.externalReference },
      });
      if (bankAccount) {
        return customer.externalReference;
      }
    }

    const provider = await this.providerRepository.findOne({
      where: { asaas_id: customer.id },
    });

    return provider?.property || null;
  }

  async createRevenueFromAsaasPayment(
    payment: Payment,
    customer?: Costumer,
  ): Promise<Transaction | null> {
    let resolvedCustomer = customer;

    if (!resolvedCustomer && payment.customer) {
      try {
        resolvedCustomer = await this.asaasService.getCostumer(payment.customer);
      } catch (error) {
        this.logger.warn(
          `Cliente Asaas ${payment.customer} não encontrado para pagamento ${payment.id}`,
        );
        return null;
      }
    }

    const propertyId = resolvedCustomer
      ? await this.resolvePropertyIdFromAsaasCustomer(resolvedCustomer)
      : null;

    if (!propertyId) {
      this.logger.warn(
        `Não foi possível resolver property_id para pagamento Asaas ${payment.id}`,
      );
      return null;
    }

    const bankAccount = await this.bankAccountRepository.findOne({
      where: { property_id: propertyId },
      order: { createdAt: 'ASC' },
    });

    const category = await this.categoryRepository.findOne({
      where: { property_id: propertyId, type: CategoryType.REVENUE },
      order: { createdAt: 'ASC' },
    });

    if (!bankAccount || !category) {
      this.logger.warn(
        `Conta bancária ou categoria de receita não encontrada para property ${propertyId}`,
      );
      return null;
    }

    const dueDate = payment.dueDate ? new Date(payment.dueDate) : new Date();
    const valueCents = this.paymentValueToCents(payment.value);

    const transaction = await this.transactionRepository.save(
      this.transactionRepository.create({
        type: TransactionType.REVENUE,
        property_id: propertyId,
        description: payment.description || `Receita Asaas ${payment.id}`,
        datetime: dueDate,
        original_value: valueCents,
        beneficiary_name: resolvedCustomer?.name || null,
        payer_cpf: resolvedCustomer?.cpfCnpj || null,
        payer_email: resolvedCustomer?.email || null,
        payer_phone: resolvedCustomer?.phone || resolvedCustomer?.mobilePhone,
        asaas_customer_id: payment.customer,
        import_source: TransactionImportSource.ASAAS,
        bankAccount: { id: bankAccount.id },
        category: { id: category.id },
      }),
    );

    await this.transactionRepository.update(transaction.id, {
      checkout_id: transaction.id,
    });

    await this.installmentRepository.save(
      this.installmentRepository.create({
        due_date: dueDate,
        value: valueCents,
        parcel: payment.installmentNumber || 1,
        transaction: { id: transaction.id },
        status: this.mapAsaasToInstallmentStatus(payment.status),
      }),
    );

    const linked = await this.linkTransactionToAsaasPayment(
      await this.reloadTransaction(transaction.id),
      payment,
      {
        syncExternalReference: true,
        payerFields: {
          payer_cpf: resolvedCustomer?.cpfCnpj || null,
          payer_email: resolvedCustomer?.email || null,
          payer_phone:
            resolvedCustomer?.phone || resolvedCustomer?.mobilePhone || null,
        },
      },
    );

    return linked;
  }

  async handleRevenueWebhook(payload: AsaasWebhookPayload): Promise<void> {
    const payment = payload.payment;
    if (!payment?.id) {
      return;
    }

    let transaction: Transaction | null = null;
    let isEntry = false;
    let customer: Costumer | undefined;
    let propertyId: string | undefined;

    if (payment.externalReference) {
      isEntry = payment.externalReference.endsWith(':entry');
      const transactionId = isEntry
        ? payment.externalReference.replace(/:entry$/, '')
        : payment.externalReference;

      transaction = await this.transactionRepository.findOne({
        where: { id: transactionId },
        relations: { installments: true },
      });
    }

    if (!transaction) {
      transaction = await this.findTransactionByAsaasPaymentId(payment.id);
    }

    if (!transaction) {
      try {
        customer = payment.customer
          ? await this.asaasService.getCostumer(payment.customer)
          : undefined;
      } catch {
        customer = undefined;
      }

      propertyId = customer
        ? await this.resolvePropertyIdFromAsaasCustomer(customer)
        : undefined;

      transaction = await this.findMatchingTransactionForPayment(
        payment,
        propertyId,
        customer?.cpfCnpj,
      );

      if (transaction) {
        isEntry = payment.externalReference?.endsWith(':entry') ?? false;
        transaction = await this.linkTransactionToAsaasPayment(
          transaction,
          payment,
          {
            isEntry,
            customer,
            syncExternalReference: true,
          },
        );
        this.logger.log(
          `Transação ${transaction.id} vinculada ao pagamento Asaas ${payment.id}`,
        );
      }
    }

    if (!transaction) {
      if (!customer && payment.customer) {
        try {
          customer = await this.asaasService.getCostumer(payment.customer);
        } catch {
          customer = undefined;
        }
      }

      if (!propertyId && customer) {
        propertyId = await this.resolvePropertyIdFromAsaasCustomer(customer);
      }

      const ofxImport = await this.findOfxImportForPayment(payment, propertyId);
      if (ofxImport) {
        this.logger.log(
          `Pagamento Asaas ${payment.id} já consta no extrato (OFX ${ofxImport.id}); não será criada receita duplicada`,
        );
        return;
      }

      transaction = await this.createRevenueFromAsaasPayment(payment, customer);
      if (!transaction) {
        this.logger.warn(`Pagamento Asaas órfão: ${payment.id}`);
        return;
      }

      isEntry = payment.externalReference?.endsWith(':entry') ?? false;
      this.logger.log(
        `Receita ${transaction.id} criada automaticamente a partir do pagamento Asaas ${payment.id}`,
      );
    }

    await this.applyPaymentUpdateToTransaction(
      transaction,
      payment,
      isEntry,
      payload.event,
    );
  }

  private async reloadTransaction(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: { installments: true },
    });
  }
}

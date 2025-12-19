import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from './entity/bank-account.entity';
import {
  Between,
  Equal,
  In,
  IsNull,
  LessThan,
  MoreThanOrEqual,
  Or,
  Repository,
} from 'typeorm';
import { BankAccountDTO } from './dto/bank-account.dto';
import {
  Category,
  CategoryType,
  FieldEntity,
  FieldType,
} from './entity/category.entity';
import { CategoryDTO, FilterCategoryDTO } from './dto/category.dto';
import { AnimalService } from '../animal/animal.service';
import {
  FilterPeriodDate,
  QueryTransaction,
  Transaction,
  TransactionType,
} from './entity/transaction.entity';
import {
  Period,
  TransactionDTO,
  TransactionUpdateDTO,
} from './dto/transaction.dto';
import { Installment, InstallmentStatus } from './entity/installment.entity';
import { S3Service } from '../s3/s3.service';
import { CompetitionService } from '../competition/competition.service';
// import { parse as parseOFX } from 'ofx-js';
import { Ofx } from 'ofx-data-extractor';
import { OneSignalService } from 'src/services/one-signal/one-signal.service';

@Injectable()
export class FinancialService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Installment)
    private installmentRepository: Repository<Installment>,
    private readonly competitionService: CompetitionService,
    private readonly animalService: AnimalService,
    private readonly s3Service: S3Service,
    private readonly oneSignalService: OneSignalService,
  ) {}

  private getSendAfterFromDueDate(
    dueDateUTC: Date,
    daysBefore = 1,
  ): string | undefined {
    const timeZoneOffset = -3;

    const dueDateTime =
      dueDateUTC instanceof Date ? dueDateUTC : new Date(dueDateUTC);

    const sendDate = new Date(dueDateTime.getTime());
    sendDate.setUTCDate(sendDate.getUTCDate() - daysBefore);

    const now = new Date();
    const nowLocal = new Date(now.getTime() + timeZoneOffset * 60 * 60 * 1000);

    console.log(`dueDateUTC: ${dueDateTime.toISOString()}`);
    console.log(`sendDate (calculada para envio): ${sendDate.toISOString()}`);
    console.log(`nowLocal (ajustado para GMT-3): ${nowLocal.toISOString()}`);

    if (sendDate > nowLocal) {
      return new Date(sendDate.getTime() + 3 * 60 * 60 * 1000).toISOString();
    } else {
      console.warn(
        `Lembrete para ${dueDateTime.toISOString()} com ${daysBefore} dias antes, resultaria em envio imediato (${sendDate.toISOString()}). Não será agendado.`,
      );
      return undefined;
    }
  }

  async getQuantityBankAccountAndCategory(
    property_id?: string,
  ): Promise<{ bankAccount: number; category: number }> {
    const bankAccount = await this.bankAccountRepository.count({
      where: { property_id: property_id || undefined },
    });

    const category = await this.categoryRepository.count({
      where: { property_id: property_id || undefined },
    });

    return { bankAccount, category };
  }

  // ** Bank Account ** //
  async createBankAccount(bankAccount: BankAccountDTO): Promise<BankAccount> {
    return await this.bankAccountRepository.save(bankAccount);
  }

  async findAllBankAccount(property_id?: string): Promise<BankAccount[]> {
    return await this.bankAccountRepository.find({
      where: { property_id: property_id || undefined },
    });
  }

  async findBankByAgencyAndAccount(
    agency: string,
    account: string,
    property_id?: string,
  ): Promise<BankAccount | null> {
    return await this.bankAccountRepository.findOne({
      where: {
        agency,
        account,
        property_id: property_id || undefined,
      },
    });
  }

  async findNamesBankAccount(
    property_id?: string,
  ): Promise<{ label: string; value: string }[]> {
    const bankAccounts = await this.bankAccountRepository.find({
      where: { property_id: property_id || undefined },
      order: {
        bank: 'ASC',
      },
    });
    return bankAccounts.map((bankAccount) => ({
      label: `${bankAccount.bank} (${bankAccount.account})`,
      value: bankAccount.id,
    }));
  }

  async findOneBankAccount(id: string): Promise<BankAccount> {
    return await this.bankAccountRepository.findOne({ where: { id } });
  }

  async updateBankAccount(
    id: string,
    bankAccount: BankAccountDTO,
  ): Promise<BankAccount> {
    await this.bankAccountRepository.update(id, bankAccount);
    return this.findOneBankAccount(id);
  }

  async removeBankAccount(id: string): Promise<{ message: string }> {
    await this.bankAccountRepository.delete(id);
    return { message: 'Bank Account removed successfully' };
  }

  // ** Category ** //
  async createCategory(category: CategoryDTO): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  async findAllCategories(query?: FilterCategoryDTO): Promise<Category[]> {
    const { property_id, type } = query;

    return await this.categoryRepository.find({
      where: {
        property_id: property_id ? Or(Equal(property_id), IsNull()) : undefined,
        type: type || undefined,
      },
    });
  }

  async findCategoryNames(
    query?: FilterCategoryDTO,
  ): Promise<{ label: string; value: string }[]> {
    const { property_id, type } = query;

    const categories = await this.categoryRepository.find({
      where: {
        property_id: property_id ? Or(Equal(property_id), IsNull()) : undefined,
        type: type || undefined,
      },
      order: {
        name: 'ASC',
      },
    });
    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }

  async getFieldsByCategoryId(id: string, property_id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    return await Promise.all(
      category.fields.map(async (field) => {
        if (!field.items || field.items.length === 0) {
          field.items = [];
        }

        if (field.type === FieldType.ENTITY) {
          if (field.entity === FieldEntity.ANIMAL) {
            field.items.push(
              ...(await this.animalService.findAllNamesWithId(
                undefined,
                property_id,
              )),
            );
          } else if (field.entity === FieldEntity.ANIMAL_MALE) {
            field.items.push(
              ...(await this.animalService.findAllNamesWithId(
                'male',
                property_id,
              )),
            );
          } else if (field.entity === FieldEntity.COMPETITION) {
            field.items.push(
              ...(await this.competitionService.findNames(property_id)),
            );
          } else {
            field.items.push(
              ...(await this.animalService.findAllNamesWithId(
                'female',
                property_id,
              )),
            );
          }
        }

        return field;
      }),
    );
  }

  async findOneCategory(id: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async updateCategory(id: string, category: CategoryDTO): Promise<Category> {
    await this.categoryRepository.update(id, category);
    return this.findOneCategory(id);
  }

  async removeCategory(id: string): Promise<{ message: string }> {
    await this.categoryRepository.delete(id);
    return { message: 'Category removed successfully' };
  }

  async deleteAllCategories(): Promise<{ message: string }> {
    await this.categoryRepository.delete({});
    return { message: 'Categories removed successfully' };
  }

  // ** Transaction ** //
  async createTransaction(data: TransactionDTO) {
    const { bank_account_id, category_id } = data;

    const bankAccount = await this.bankAccountRepository.findOne({
      where: { id: bank_account_id },
    });

    const category = await this.categoryRepository.findOne({
      where: { id: category_id },
    });

    if (!bankAccount) {
      console.error('Bank account not found');
      throw new NotFoundException('Bank account not found');
    }

    if (!category) {
      console.error('Category not found');
      throw new NotFoundException('Category not found');
    }

    if (!data.is_installment && !data.is_periodically) {
      const transactionDueDate = new Date(data.datetime);
      console.log('data.datetime', data.datetime);
      const sendAfter = this.getSendAfterFromDueDate(transactionDueDate);
      console.log('sendAfter', sendAfter);

      const formattedDate = transactionDueDate.toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      });

      const message = `Uma transação do tipo ${
        data.type === 'revenue'
          ? `receita, deve ser recebida até dia ${formattedDate}.`
          : `despesa, vence dia ${formattedDate}.`
      } `;

      await this.oneSignalService.sendNotification(
        data.property_id,
        'Alerta de Transação',
        message,
        sendAfter,
      );
      const transaction = this.transactionRepository.create({
        bankAccount: { id: bank_account_id },
        category: { id: category_id },
        beneficiary_name: data.beneficiary_name,
        commission_type: data.commission_type,
        commission_value: data.commission_value,
        datetime: data.datetime,
        description: data.description,
        extra_fields: data.extra_fields,
        original_value: data.original_value,
        property_id: data.property_id,
        type: data.type,
      });

      const newTransaction = await this.transactionRepository.save(transaction);

      const installment = this.installmentRepository.create({
        due_date: data.datetime,
        value: data.original_value,
        transaction: { id: newTransaction.id },
      });

      await this.installmentRepository.save(installment);

      return await this.transactionRepository.findOne({
        where: { id: newTransaction.id },
        relations: {
          bankAccount: true,
          category: true,
          installments: true,
        },
      });
    } else if (!data.is_installment && data.is_periodically) {
      if (!data.max_date_period) {
        throw new NotFoundException('Max date period not found');
      }

      let transactionReturn: Transaction | undefined = undefined;

      switch (data.period) {
        case Period.WEEKLY:
          for (
            let i = new Date(data.datetime);
            i.getTime() <= new Date(data.max_date_period).getTime();
            i.setDate(i.getDate() + 7)
          ) {
            const newTransaction = this.transactionRepository.create({
              bankAccount: { id: bank_account_id },
              category: { id: category_id },
              beneficiary_name: data.beneficiary_name,
              commission_type: data.commission_type,
              commission_value: data.commission_value,
              datetime: new Date(i),
              description: data.description,
              extra_fields: data.extra_fields,
              original_value: data.original_value,
              property_id: data.property_id,
              period: data.period,
              type: data.type,
            });

            const transaction = await this.transactionRepository.save(
              newTransaction,
            );

            const installment = this.installmentRepository.create({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });

            await this.installmentRepository.save(installment);

            if (!transactionReturn) {
              transactionReturn = transaction;
            }
          }
          break;
        case Period.MONTHLY:
          for (
            let i = new Date(data.datetime);
            i.getTime() <= new Date(data.max_date_period).getTime();
            i.setMonth(i.getMonth() + 1)
          ) {
            const newTransaction = this.transactionRepository.create({
              bankAccount: { id: bank_account_id },
              category: { id: category_id },
              beneficiary_name: data.beneficiary_name,
              commission_type: data.commission_type,
              commission_value: data.commission_value,
              datetime: new Date(i),
              description: data.description,
              extra_fields: data.extra_fields,
              original_value: data.original_value,
              property_id: data.property_id,
              period: data.period,
              type: data.type,
            });

            const transaction = await this.transactionRepository.save(
              newTransaction,
            );

            const installment = this.installmentRepository.create({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });

            await this.installmentRepository.save(installment);

            if (!transactionReturn) {
              transactionReturn = transaction;
            }
          }
          break;
        case Period.BIWEEKLY:
          for (
            let i = new Date(data.datetime);
            i.getTime() <= new Date(data.max_date_period).getTime();
            i.setDate(i.getDate() + 14)
          ) {
            const newTransaction = this.transactionRepository.create({
              bankAccount: { id: bank_account_id },
              category: { id: category_id },
              beneficiary_name: data.beneficiary_name,
              commission_type: data.commission_type,
              commission_value: data.commission_value,
              datetime: new Date(i),
              description: data.description,
              extra_fields: data.extra_fields,
              original_value: data.original_value,
              property_id: data.property_id,
              period: data.period,
              type: data.type,
            });

            const transaction = await this.transactionRepository.save(
              newTransaction,
            );

            const installment = this.installmentRepository.create({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });

            await this.installmentRepository.save(installment);

            if (!transactionReturn) {
              transactionReturn = transaction;
            }
          }
          break;
        case Period.BIMONTHLY:
          for (
            let i = new Date(data.datetime);
            i.getTime() <= new Date(data.max_date_period).getTime();
            i.setMonth(i.getMonth() + 2)
          ) {
            const newTransaction = this.transactionRepository.create({
              bankAccount: { id: bank_account_id },
              category: { id: category_id },
              beneficiary_name: data.beneficiary_name,
              commission_type: data.commission_type,
              commission_value: data.commission_value,
              datetime: new Date(i),
              description: data.description,
              extra_fields: data.extra_fields,
              original_value: data.original_value,
              property_id: data.property_id,
              period: data.period,
              type: data.type,
            });

            const transaction = await this.transactionRepository.save(
              newTransaction,
            );

            const installment = this.installmentRepository.create({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });

            await this.installmentRepository.save(installment);

            if (!transactionReturn) {
              transactionReturn = transaction;
            }
          }
          break;
        case Period.QUARTERLY:
          for (
            let i = new Date(data.datetime);
            i.getTime() <= new Date(data.max_date_period).getTime();
            i.setMonth(i.getMonth() + 3)
          ) {
            const newTransaction = this.transactionRepository.create({
              bankAccount: { id: bank_account_id },
              category: { id: category_id },
              beneficiary_name: data.beneficiary_name,
              commission_type: data.commission_type,
              commission_value: data.commission_value,
              datetime: new Date(i),
              description: data.description,
              extra_fields: data.extra_fields,
              original_value: data.original_value,
              property_id: data.property_id,
              period: data.period,
              type: data.type,
            });

            const transaction = await this.transactionRepository.save(
              newTransaction,
            );

            const installment = this.installmentRepository.create({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });

            await this.installmentRepository.save(installment);

            if (!transactionReturn) {
              transactionReturn = transaction;
            }
          }
          break;
        case Period.SEMIANNUALLY:
          for (
            let i = new Date(data.datetime);
            i.getTime() <= new Date(data.max_date_period).getTime();
            i.setMonth(i.getMonth() + 6)
          ) {
            const newTransaction = this.transactionRepository.create({
              bankAccount: { id: bank_account_id },
              category: { id: category_id },
              beneficiary_name: data.beneficiary_name,
              commission_type: data.commission_type,
              commission_value: data.commission_value,
              datetime: new Date(i),
              description: data.description,
              extra_fields: data.extra_fields,
              original_value: data.original_value,
              property_id: data.property_id,
              period: data.period,
              type: data.type,
            });

            const transaction = await this.transactionRepository.save(
              newTransaction,
            );

            const installment = this.installmentRepository.create({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });

            await this.installmentRepository.save(installment);

            if (!transactionReturn) {
              transactionReturn = transaction;
            }
          }
          break;
        case Period.ANNUALLY:
          for (
            let i = new Date(data.datetime);
            i.getTime() <= new Date(data.max_date_period).getTime();
            i.setFullYear(i.getFullYear() + 1)
          ) {
            const newTransaction = this.transactionRepository.create({
              bankAccount: { id: bank_account_id },
              category: { id: category_id },
              beneficiary_name: data.beneficiary_name,
              commission_type: data.commission_type,
              commission_value: data.commission_value,
              datetime: new Date(i),
              description: data.description,
              extra_fields: data.extra_fields,
              original_value: data.original_value,
              property_id: data.property_id,
              period: data.period,
              type: data.type,
            });

            const transaction = await this.transactionRepository.save(
              newTransaction,
            );

            const installment = this.installmentRepository.create({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });

            await this.installmentRepository.save(installment);

            if (!transactionReturn) {
              transactionReturn = transaction;
            }
          }
          break;
        default:
          console.error('Period not found');
          throw new NotFoundException('Period not found');
      }
      const transactionDueDate = new Date(data.datetime);
      console.log('data.datetime', data.datetime);
      const sendAfter = this.getSendAfterFromDueDate(transactionDueDate); // 2 dias antes, 12:00h local
      console.log('sendAfter', sendAfter);

      const formattedDate = transactionDueDate.toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      });

      const message = `Uma transação do tipo ${
        data.type === 'revenue'
          ? `receita, deve ser recebida até dia ${formattedDate}.`
          : `despesa, vence dia ${formattedDate}.`
      } `;

      await this.oneSignalService.sendNotification(
        data.property_id,
        'Alerta de Transação',
        message,
        sendAfter,
      );

      return transactionReturn;
    } else {
      if (!data.installments) {
        console.error('Installments not found');
        throw new NotFoundException('Installments not found');
      }

      const transactionDueDate = new Date(data.datetime);
      console.log('data.datetime', data.datetime);
      const sendAfter = this.getSendAfterFromDueDate(transactionDueDate); // 2 dias antes, 12:00h local
      console.log('sendAfter', sendAfter);

      const formattedDate = transactionDueDate.toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      });

      const message = `Uma transação do tipo ${
        data.type === 'revenue'
          ? `receita, deve ser recebida até dia ${formattedDate}.`
          : `despesa, vence dia ${formattedDate}.`
      } `;

      await this.oneSignalService.sendNotification(
        data.property_id,
        'Alerta de Transação',
        message,
        sendAfter,
      );

      const transaction = this.transactionRepository.create({
        bankAccount: { id: bank_account_id },
        category: { id: category_id },
        beneficiary_name: data.beneficiary_name,
        commission_type: data.commission_type,
        commission_value: data.commission_value,
        datetime: data.datetime,
        description: data.description,
        extra_fields: data.extra_fields,
        original_value: data.original_value,
        property_id: data.property_id,
        type: data.type,
      });

      const newTransaction = await this.transactionRepository.save(transaction);

      const installments = [];

      for (let i = 0; i < data.installments; i++) {
        const dueDate = new Date(data.due_date);
        dueDate.setMonth(dueDate.getMonth() + i);

        installments.push({
          due_date: dueDate,
          value: data.original_value / data.installments,
          transaction: { id: newTransaction.id },
        });
      }

      installments.map(async (installment) => {
        const newInstallment = this.installmentRepository.create(installment);
        await this.installmentRepository.save(newInstallment);
      });

      return await this.transactionRepository.findOne({
        where: { id: newTransaction.id },
        relations: {
          bankAccount: true,
          category: true,
          installments: true,
        },
      });
    }
  }

  async updateTransaction(id: string, data: TransactionUpdateDTO) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return await this.transactionRepository.save({
      id,
      type: data.type,
      datetime: new Date(data.datetime),
      description: data.description,
      bankAccount: { id: data.bank_account_id },
      category: { id: data.category_id },
      extra_fields: data.extra_fields,
      original_value: data.original_value,
      commission_type: data.commission_type,
      commission_value: data.commission_value,
      beneficiary_name: data.beneficiary_name,
    });
  }

  async updateDocuments(id: string, files: Array<Express.Multer.File>) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (files) {
      if (files['contract_file'] && files['contract_file'].length > 0) {
        if (transaction.contract_file) {
          await this.s3Service.deleteFileS3(transaction.contract_file);
        }

        transaction.contract_file = await this.s3Service.upload(
          files['contract_file'][0],
          'contract_file',
        );
      }

      if (files['invoice_file'] && files['invoice_file'].length > 0) {
        if (transaction.invoice_file) {
          await this.s3Service.deleteFileS3(transaction.invoice_file);
        }

        transaction.invoice_file = await this.s3Service.upload(
          files['invoice_file'][0],
          'invoice_file',
        );
      }

      if (files['receipt_file'] && files['receipt_file'].length > 0) {
        if (transaction.receipt_file) {
          await this.s3Service.deleteFileS3(transaction.receipt_file);
        }

        transaction.receipt_file = await this.s3Service.upload(
          files['receipt_file'][0],
          'receipt_file',
        );
      }

      if (files['attachments_files'] && files['attachments_files'].length > 0) {
        if (!transaction.attachments_files) {
          transaction.attachments_files = [];
        }

        for (const file of files['attachments_files']) {
          const url = await this.s3Service.upload(file, 'attachments_files');
          transaction.attachments_files.push(url);
        }
      }
    }
    return await this.transactionRepository.save(transaction);
  }

  async removeAttachmentFile(id: string, index: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.attachments_files) {
      transaction.attachments_files = transaction.attachments_files.filter(
        (_, i) => i !== index,
      );
    }

    const transactionUpdated = await this.transactionRepository.save(
      transaction,
    );

    if (transaction.attachments_files && transaction.attachments_files[index]) {
      await this.s3Service.deleteFileS3(transaction.attachments_files[index]);
    }

    return transactionUpdated;
  }

  async removeFile(id: string, file: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (file === 'contract_file' && transaction.contract_file) {
      await this.s3Service.deleteFileS3(transaction.contract_file);
      transaction.contract_file = null;
    } else if (file === 'invoice_file' && transaction.invoice_file) {
      await this.s3Service.deleteFileS3(transaction.invoice_file);
      transaction.invoice_file = null;
    } else if (file === 'receipt_file' && transaction.receipt_file) {
      await this.s3Service.deleteFileS3(transaction.receipt_file);
      transaction.receipt_file = null;
    } else {
      throw new NotFoundException(
        'File not found. file must be contract_file, invoice_file or receipt_file',
      );
    }

    return await this.transactionRepository.save(transaction);
  }

  async getAllTransactions(property_id?: string) {
    return await this.transactionRepository.find({
      where: {
        property_id: property_id || undefined,
      },
      relations: {
        bankAccount: true,
        category: true,
        installments: true,
      },
    });
  }

  async getAnalyticsTransactions(property_id: string) {
    const now = new Date();

    const currentDay = now.getDay();
    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - currentDay);
    lastSunday.setHours(0, 0, 0, 0);

    const nextSaturday = new Date(lastSunday);
    nextSaturday.setDate(lastSunday.getDate() + 6);
    nextSaturday.setHours(23, 59, 59, 999);

    const transactions = await this.transactionRepository.find({
      where: {
        property_id: property_id ? Or(Equal(property_id), IsNull()) : undefined,
        datetime: Between(lastSunday, nextSaturday),
      },
      relations: ['installments'],
      order: { datetime: 'ASC' },
    });

    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const analytics = Array(7).fill(0);

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.datetime);
      const dayOfWeek = transactionDate.getDay();

      transaction.installments.forEach((installment) => {
        const value = Number(installment.value);

        if (transaction.type === TransactionType.EXPENSE) {
          analytics[dayOfWeek] -= value;
        } else if (transaction.type === TransactionType.REVENUE) {
          analytics[dayOfWeek] += value;
        }
      });
    });

    const allTransactions = await this.transactionRepository.find({
      where: {
        property_id: property_id ? Or(Equal(property_id), IsNull()) : undefined,
      },
      relations: ['installments'],
    });

    let balance = 0;
    let payableValue = 0;
    let receivableValue = 0;

    allTransactions.forEach((transaction) => {
      transaction.installments.forEach((installment) => {
        const value = Number(installment.value);

        if (installment.status === InstallmentStatus.PAID) {
          if (transaction.type === TransactionType.EXPENSE) {
            balance -= value;
          } else if (transaction.type === TransactionType.REVENUE) {
            balance += value;
          }
        } else {
          if (transaction.type === TransactionType.EXPENSE) {
            payableValue += value;
          } else if (transaction.type === TransactionType.REVENUE) {
            receivableValue += value;
          }
        }
      });
    });

    return {
      balance,
      payableValue,
      receivableValue,
      labels: weekDays,
      datasets: [{ data: analytics }],
    };
  }

  async getAllTransactionsGroupedByDate(query: QueryTransaction) {
    const {
      property_id,
      period_date,
      bank_account_id,
      category_id,
      end_date,
      start_date,
      type,
    } = query;

    const transactions = await this.transactionRepository.find({
      where: {
        property_id: property_id ? Or(Equal(property_id), IsNull()) : undefined,
        bankAccount: {
          id: bank_account_id || undefined,
        },
        category: {
          id: category_id || undefined,
        },
        type: type || undefined,
        datetime: period_date
          ? period_date === FilterPeriodDate.TODAY
            ? Between(
                new Date(new Date().setHours(0, 0, 0, 0)),
                new Date(new Date().setHours(23, 59, 59, 999)),
              )
            : period_date === FilterPeriodDate.SEVEN_DAYS
            ? Between(
                new Date(new Date().setDate(new Date().getDate() - 7)),
                new Date(),
              )
            : period_date === FilterPeriodDate.THIRTY_DAYS
            ? Between(
                new Date(new Date().setDate(new Date().getDate() - 30)),
                new Date(),
              )
            : undefined
          : start_date && end_date
          ? Between(new Date(start_date), new Date(end_date))
          : start_date
          ? MoreThanOrEqual(new Date(start_date))
          : end_date
          ? LessThan(new Date(end_date))
          : undefined,
      },
      relations: {
        bankAccount: true,
        category: true,
        installments: true,
      },
      order: {
        datetime: 'DESC',
        installments: {
          due_date: 'ASC',
        },
      },
    });

    const groups: {
      date: string;
      total: number;
      transactions: Transaction[];
    }[] = [];

    transactions.forEach((transaction) => {
      const date = new Date(transaction.datetime).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const group = groups.find((group) => group.date === date);

      if (group) {
        group.transactions.push(transaction);
        group.total += transaction.original_value;
      } else {
        groups.push({
          date,
          total: transaction.original_value,
          transactions: [transaction],
        });
      }
    });

    groups.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    groups.forEach((group) => {
      group.transactions.sort(
        (a, b) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
      );
    });

    return groups;
  }

  async getTransactionById(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        bankAccount: true,
        category: true,
        installments: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async getExpensesByCompetitionId(competition_id: string) {
    let transactions = await this.transactionRepository.find({
      where: {
        type: TransactionType.EXPENSE,
      },
      relations: {
        category: true,
      },
    });

    transactions = transactions.filter((transaction) =>
      transaction.extra_fields.some((field) => field.id === competition_id),
    );

    const total = transactions.reduce((acc, transaction) => {
      return acc + transaction.original_value;
    }, 0);

    return { total, data: transactions };
  }

  updateStatusInstallment(
    id: string,
    status: InstallmentStatus,
  ): Promise<Installment> {
    return this.installmentRepository.save({
      id,
      status,
    });
  }

  async deleteTransaction(id: string): Promise<{ message: string }> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await this.transactionRepository.delete(id);
    return { message: 'Transaction removed successfully' };
  }

  async deleteAllTransactions(): Promise<{ message: string }> {
    await this.transactionRepository.delete({});
    return { message: 'Transactions removed successfully' };
  }

  async importTransactionsByOfx(
    file: Express.Multer.File,
    property_id: string,
  ) {
    const ofxString = file.buffer.toString('utf-8');
    const ofxData = new Ofx(ofxString);

    const ofxContent = ofxData.getContent();

    const orgInfo = ofxContent.OFX.SIGNONMSGSRSV1.SONRS.FI.ORG;
    const bankAccFrom =
      ofxContent.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM;
    const bankTranList = ofxData.getBankTransferList();

    let bank = await this.findBankByAgencyAndAccount(
      bankAccFrom.ACCTID,
      bankAccFrom.BRANCHID,
    );

    if (!bank) {
      bank = await this.createBankAccount({
        description: orgInfo,
        property_id,
        bank: orgInfo,
        agency: bankAccFrom.BRANCHID,
        account: bankAccFrom.ACCTID,
        keyJ: '',
      });
    }

    const transactions: Transaction[] = [];

    await Promise.all(
      bankTranList.map(async (transaction) => {
        const newTransaction = await this.createTransaction({
          bank_account_id: bank.id,
          datetime: new Date(transaction.DTPOSTED),
          description: transaction.MEMO,
          property_id: property_id,
          original_value:
            transaction.TRNAMT > 0
              ? Number((transaction.TRNAMT * 100).toFixed(0))
              : Number((-1 * transaction.TRNAMT * 100).toFixed(0)),
          type:
            transaction.TRNAMT > 0
              ? TransactionType.REVENUE
              : TransactionType.EXPENSE,
          is_installment: false,
          installments: 0,
          extra_fields: [],
        });

        transactions.push(newTransaction);
      }),
    );

    return {
      message: 'Transactions imported successfully',
      transactions,
    };
  }

  async getAnimalSalesTransactions(property_id: string) {
    const salesCategories = [
      'Venda de Animal',
      'Venda de Cobertura',
      'Venda de Embriões',
      'Venda de Ventres',
    ];

    const transactions = await this.transactionRepository.find({
      where: {
        property_id,
        type: TransactionType.REVENUE,
        category: {
          name: In(salesCategories),
        },
      },
      relations: {
        bankAccount: true,
        category: true,
        installments: true,
      },
      order: {
        datetime: 'DESC',
      },
    });

    return transactions;
  }

  async getAnimalSalesTransactionsById(
    property_id: string,
    category_ids: string[],
  ) {
    return await this.transactionRepository.find({
      where: {
        property_id,
        type: TransactionType.REVENUE,
        category: {
          id: In(category_ids),
        },
      },
      relations: {
        bankAccount: true,
        category: true,
        installments: true,
      },
      order: {
        datetime: 'DESC',
      },
    });
  }

  async getAnimalSalesCategories(property_id?: string) {
    const salesCategoriesNames = [
      'Venda de Animal',
      'Venda de Cobertura',
      'Venda de Embriões',
      'Venda de Ventres',
    ];

    return await this.categoryRepository.find({
      where: {
        name: In(salesCategoriesNames),
        type: CategoryType.REVENUE,
        property_id: property_id ? Or(Equal(property_id), IsNull()) : undefined,
      },
    });
  }

  async getAnimalPurchaseTransactions(property_id: string) {
    const purchaseCategories = [
      'Compra de Animal',
      'Compra de Cobertura',
      'Compra de Embriões',
      'Compra de Ventres',
    ];

    const transactions = await this.transactionRepository.find({
      where: {
        property_id,
        type: TransactionType.EXPENSE,
        category: {
          name: In(purchaseCategories),
        },
      },
      relations: {
        bankAccount: true,
        category: true,
        installments: true,
      },
      order: {
        datetime: 'DESC',
      },
    });

    return transactions;
  }

  async getAnimalPurchaseCategories(property_id?: string) {
    const purchaseCategoriesNames = [
      'Compra de Animal',
      'Compra de Cobertura',
      'Compra de Embriões',
      'Compra de Ventres',
    ];

    return await this.categoryRepository.find({
      where: {
        name: In(purchaseCategoriesNames),
        type: CategoryType.EXPENSE,
        property_id: property_id ? Or(Equal(property_id), IsNull()) : undefined,
      },
    });
  }

  async getAnimalPurchasesWithFilters(filters: any) {
    const { property_id, purchase_type, start_date, end_date, animal_id } =
      filters;

    const purchaseCategoriesMap = {
      animal: 'Compra de Animal',
      cobertura: 'Compra de Cobertura',
      embriao: 'Compra de Embriões',
      ventre: 'Compra de Ventres',
    };

    const whereConditions: any = {
      property_id,
      type: TransactionType.EXPENSE,
    };

    if (
      purchase_type &&
      purchase_type !== 'all' &&
      purchaseCategoriesMap[purchase_type]
    ) {
      whereConditions.category = {
        name: purchaseCategoriesMap[purchase_type],
      };
    } else if (purchase_type === 'all' || !purchase_type) {
      whereConditions.category = {
        name: In(Object.values(purchaseCategoriesMap)),
      };
    }

    if (start_date && end_date) {
      whereConditions.datetime = Between(
        new Date(start_date),
        new Date(end_date),
      );
    } else if (start_date) {
      whereConditions.datetime = MoreThanOrEqual(new Date(start_date));
    } else if (end_date) {
      whereConditions.datetime = LessThan(new Date(end_date));
    }

    const transactions = await this.transactionRepository.find({
      where: whereConditions,
      relations: {
        bankAccount: true,
        category: true,
        installments: true,
      },
      order: {
        datetime: 'DESC',
      },
    });

    if (animal_id) {
      return transactions.filter((transaction) =>
        transaction.extra_fields.some(
          (field) =>
            field.id === animal_id &&
            field.label.toLowerCase().includes('animal'),
        ),
      );
    }

    return transactions;
  }

  async getPurchaseAnalytics(property_id: string) {
    const now = new Date();

    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31);

    const allPurchases = await this.transactionRepository.find({
      where: {
        property_id,
        type: TransactionType.EXPENSE,
        category: {
          name: In([
            'Compra de Animal',
            'Compra de Cobertura',
            'Compra de Embriões',
            'Compra de Ventres',
          ]),
        },
      },
      relations: ['installments'],
    });

    const calculateTotal = (transactions: Transaction[]) => {
      return (
        transactions.reduce((total, transaction) => {
          const installmentTotal = transaction.installments.reduce(
            (sum, installment) => {
              return sum + (installment.value || 0);
            },
            0,
          );
          return total + installmentTotal;
        }, 0) / 100
      );
    };

    const purchasesLastWeek = allPurchases.filter(
      (p) => new Date(p.datetime) >= lastWeek,
    );

    const purchasesThisMonth = allPurchases.filter(
      (p) =>
        new Date(p.datetime) >= firstDayOfMonth &&
        new Date(p.datetime) <= lastDayOfMonth,
    );

    const purchasesThisYear = allPurchases.filter(
      (p) =>
        new Date(p.datetime) >= firstDayOfYear &&
        new Date(p.datetime) <= lastDayOfYear,
    );

    const purchasesByCategory = allPurchases.reduce((acc, purchase) => {
      const categoryName = purchase.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }

      const total =
        purchase.installments.reduce(
          (sum, installment) => sum + (installment.value || 0),
          0,
        ) / 100;

      acc[categoryName] += total;
      return acc;
    }, {});

    return {
      totalPurchases: allPurchases.length,
      totalValue: calculateTotal(allPurchases),
      lastWeek: {
        count: purchasesLastWeek.length,
        value: calculateTotal(purchasesLastWeek),
      },
      thisMonth: {
        count: purchasesThisMonth.length,
        value: calculateTotal(purchasesThisMonth),
      },
      thisYear: {
        count: purchasesThisYear.length,
        value: calculateTotal(purchasesThisYear),
      },
      byCategory: purchasesByCategory,
    };
  }

  async getWeeklyTotals(property_id: string) {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const salesCategories = [
      'Venda de Animal',
      'Venda de Cobertura',
      'Venda de Embriões',
      'Venda de Ventres',
    ];

    const purchaseCategories = [
      'Compra de Animal',
      'Compra de Cobertura',
      'Compra de Embriões',
      'Compra de Ventres',
    ];

    const weeklySales = await this.transactionRepository.find({
      where: {
        property_id,
        type: TransactionType.REVENUE,
        datetime: Between(oneWeekAgo, now),
        category: {
          name: In(salesCategories),
        },
      },
      relations: ['installments'],
    });

    const weeklyPurchases = await this.transactionRepository.find({
      where: {
        property_id,
        type: TransactionType.EXPENSE,
        datetime: Between(oneWeekAgo, now),
        category: {
          name: In(purchaseCategories),
        },
      },
      relations: ['installments'],
    });

    const salesTotal =
      weeklySales.reduce((total, transaction) => {
        const installmentTotal = transaction.installments.reduce(
          (sum, installment) => {
            return sum + (installment.value || 0);
          },
          0,
        );
        return total + installmentTotal;
      }, 0) / 100;

    const purchasesTotal =
      weeklyPurchases.reduce((total, transaction) => {
        const installmentTotal = transaction.installments.reduce(
          (sum, installment) => {
            return sum + (installment.value || 0);
          },
          0,
        );
        return total + installmentTotal;
      }, 0) / 100;

    return {
      weeklySales: salesTotal,
      weeklyPurchases: purchasesTotal,
      salesCount: weeklySales.length,
      purchasesCount: weeklyPurchases.length,
    };
  }

  /**<DTPOSTED>20250501000000[-3:BRT]</DTPOSTED> */
  // parseOFXDate(dateString: string) {
  //   console.log('dateString', dateString);
  //   const dateRegex = /^\d{14}(\[-?\d+:[A-Z]{3}\])?$/;

  //   if (!dateRegex.test(dateString)) {
  //     throw new Error(
  //       'Formato de data inválido. Deve ser YYYYMMDDHHMMSS ou YYYYMMDDHHMMSS[-3:BRT].',
  //     );
  //   }

  //   // Remove o timezone, se existir
  //   const cleanDateString = dateString.split('[')[0];

  //   const year = parseInt(cleanDateString.substring(0, 4), 10);
  //   const month = parseInt(cleanDateString.substring(4, 6), 10) - 1; // Mês começa em 0 no JS
  //   const day = parseInt(cleanDateString.substring(6, 8), 10);
  //   const hours = parseInt(cleanDateString.substring(8, 10), 10);
  //   const minutes = parseInt(cleanDateString.substring(10, 12), 10);
  //   const seconds = parseInt(cleanDateString.substring(12, 14), 10);

  //   return new Date(year, month, day, hours, minutes, seconds);
  // }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from './entity/bank-account.entity';
import {
  Between,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { BankAccountDTO } from './dto/bank-account.dto';
import { Category, FieldEntity, FieldType } from './entity/category.entity';
import { CategoryDTO, FilterCategoryDTO } from './dto/category.dto';
import { AnimalService } from '../animal/animal.service';
import {
  FilterPeriodDate,
  QueryTransaction,
  Transaction,
} from './entity/transaction.entity';
import { Period, TransactionDTO } from './dto/transaction.dto';
import { Installment, InstallmentStatus } from './entity/installment.entity';
import { S3Service } from '../s3/s3.service';

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
    private readonly animalService: AnimalService,
    private readonly s3Service: S3Service,
  ) {}

  // ** Bank Account ** //
  async createBankAccount(bankAccount: BankAccountDTO): Promise<BankAccount> {
    return await this.bankAccountRepository.save(bankAccount);
  }

  async findAllBankAccount(property_id?: string): Promise<BankAccount[]> {
    return await this.bankAccountRepository.find({
      where: { property_id: property_id || undefined },
    });
  }

  async findNamesBankAccount(
    property_id?: string,
  ): Promise<{ label: string; value: string }[]> {
    const bankAccounts = await this.bankAccountRepository.find({
      where: { property_id: property_id || undefined },
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
      where: { property_id: property_id || undefined, type: type || undefined },
    });
  }

  async findCategoryNames(
    query?: FilterCategoryDTO,
  ): Promise<{ label: string; value: string }[]> {
    const { property_id, type } = query;

    const categories = await this.categoryRepository.find({
      where: { property_id: property_id || undefined, type: type || undefined },
    });
    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }

  async getFieldsByCategoryId(id: string) {
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
              ...(await this.animalService.findAllNamesWithId()),
            );
          } else if (field.entity === FieldEntity.ANIMAL_MALE) {
            field.items.push(
              ...(await this.animalService.findAllNamesWithId('male')),
            );
          } else {
            field.items.push(
              ...(await this.animalService.findAllNamesWithId('female')),
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
      throw new NotFoundException('Bank account not found');
    }

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!data.is_installment && !data.is_periodically) {
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
      if (data.max_date_period) {
        throw new NotFoundException('Max date period not found');
      }

      let transaction: Transaction | undefined = undefined;

      switch (data.period) {
        case Period.WEEKLY:
          for (
            let i = data.datetime;
            i <= data.max_date_period;
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
              type: data.type,
            });

            if (!transaction) {
              transaction = await this.transactionRepository.save(
                newTransaction,
              );
            }
          }
          break;
        case Period.MONTHLY:
          for (
            let i = data.datetime;
            i <= data.max_date_period;
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
              type: data.type,
            });

            if (!transaction) {
              transaction = await this.transactionRepository.save(
                newTransaction,
              );
            }
          }
          break;
        case Period.BIWEEKLY:
          for (
            let i = data.datetime;
            i <= data.max_date_period;
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
              type: data.type,
            });

            if (!transaction) {
              transaction = await this.transactionRepository.save(
                newTransaction,
              );
            }
          }
          break;
        case Period.BIMONTHLY:
          for (
            let i = data.datetime;
            i <= data.max_date_period;
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
              type: data.type,
            });

            if (!transaction) {
              transaction = await this.transactionRepository.save(
                newTransaction,
              );
            }
          }
          break;
        case Period.QUARTERLY:
          for (
            let i = data.datetime;
            i <= data.max_date_period;
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
              type: data.type,
            });

            if (!transaction) {
              transaction = await this.transactionRepository.save(
                newTransaction,
              );
            }
          }
          break;
        case Period.SEMIANNUALLY:
          for (
            let i = data.datetime;
            i <= data.max_date_period;
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
              type: data.type,
            });

            if (!transaction) {
              transaction = await this.transactionRepository.save(
                newTransaction,
              );
            }
          }
          break;
        case Period.ANNUALLY:
          for (
            let i = data.datetime;
            i <= data.max_date_period;
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
              type: data.type,
            });

            if (!transaction) {
              transaction = await this.transactionRepository.save(
                newTransaction,
              );
            }
          }
          break;
        default:
          throw new NotFoundException('Period not found');
      }

      return transaction;
    } else {
      if (!data.installments) {
        throw new NotFoundException('Installments not found');
      }

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
          value: (data.original_value / data.installments).toFixed(2),
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

  async updateDocuments(id: string, files: Array<Express.Multer.File>) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (files) {
      if (files['contract_file'] && files['contract_file'].length > 0) {
        transaction.contract_file = await this.s3Service.upload(
          files['contract_file'][0],
          'contract_file',
        );
      }

      if (files['invoice_file'] && files['invoice_file'].length > 0) {
        transaction.invoice_file = await this.s3Service.upload(
          files['invoice_file'][0],
          'invoice_file',
        );
      }

      if (files['receipt_file'] && files['receipt_file'].length > 0) {
        transaction.receipt_file = await this.s3Service.upload(
          files['receipt_file'][0],
          'receipt_file',
        );
      }

      if (files['attachments_files'] && files['attachments_files'].length > 0) {
        transaction.attachments_files = [];

        for (const file of files['attachments_files']) {
          const url = await this.s3Service.upload(file, 'attachments_files');
          transaction.attachments_files.push(url);
        }
      }
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
        property_id: property_id || undefined,
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

  updateStatusInstallment(
    id: string,
    status: InstallmentStatus,
  ): Promise<Installment> {
    return this.installmentRepository.save({
      id,
      status,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from './entity/bank-account.entity';
import { Repository } from 'typeorm';
import { BankAccountDTO } from './dto/bank-account.dto';
import { Category, FieldEntity, FieldType } from './entity/category.entity';
import { CategoryDTO, FilterCategoryDTO } from './dto/category.dto';
import { AnimalService } from '../animal/animal.service';
import { Transaction } from './entity/transaction.entity';
import { Period, TransactionDTO } from './dto/transaction.dto';
import { Installment } from './entity/installment.entity';

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
      select: {
        fields: true,
      },
    });

    return category.fields.map(async (field) => {
      if (field.type === FieldType.ENTITY) {
        if (field.entity === FieldEntity.ANIMAL) {
          field.items.push(...(await this.animalService.findAllNamesWithId()));
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
    });
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

    const transaction = this.transactionRepository.create({
      bankAccount: { id: bank_account_id },
      category: { id: category_id },
      beneficiary_name: data.beneficiary_name,
      client_name: data.client_name,
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

    if (!data.is_installment && !data.is_periodically) {
      const installment = this.installmentRepository.create({
        due_date: data.datetime,
        value: data.original_value,
        transaction: { id: newTransaction.id },
      });

      await this.installmentRepository.save(installment);
    } else if (!data.is_installment && data.is_periodically) {
      if (data.max_date_period) {
        throw new NotFoundException('Max date period not found');
      }

      const installments = [];

      switch (data.period) {
        case Period.WEEKLY:
          for (
            let i = newTransaction.datetime;
            i <= data.max_date_period;
            i.setDate(i.getDate() + 7)
          ) {
            installments.push({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });
          }
          break;
        case Period.MONTHLY:
          for (
            let i = newTransaction.datetime;
            i <= data.max_date_period;
            i.setMonth(i.getMonth() + 1)
          ) {
            installments.push({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });
          }
          break;
        case Period.BIWEEKLY:
          for (
            let i = newTransaction.datetime;
            i <= data.max_date_period;
            i.setDate(i.getDate() + 14)
          ) {
            installments.push({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });
          }
          break;
        case Period.BIMONTHLY:
          for (
            let i = newTransaction.datetime;
            i <= data.max_date_period;
            i.setMonth(i.getMonth() + 2)
          ) {
            installments.push({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });
          }
          break;
        case Period.QUARTERLY:
          for (
            let i = newTransaction.datetime;
            i <= data.max_date_period;
            i.setMonth(i.getMonth() + 3)
          ) {
            installments.push({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });
          }
          break;
        case Period.SEMIANNUALLY:
          for (
            let i = newTransaction.datetime;
            i <= data.max_date_period;
            i.setMonth(i.getMonth() + 6)
          ) {
            installments.push({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });
          }
          break;
        case Period.ANNUALLY:
          for (
            let i = newTransaction.datetime;
            i <= data.max_date_period;
            i.setFullYear(i.getFullYear() + 1)
          ) {
            installments.push({
              due_date: new Date(i),
              value: data.original_value,
              transaction: { id: newTransaction.id },
            });
          }
          break;
        default:
          throw new NotFoundException('Period not found');
      }

      installments.map(async (installment) => {
        const newInstallment = this.installmentRepository.create(installment);
        await this.installmentRepository.save(newInstallment);
      });
    } else {
      if (!data.installments) {
        throw new NotFoundException('Installments not found');
      }

      const installments = [];

      for (let i = 0; i < data.installments; i++) {
        const dueDate = new Date(data.due_date);
        dueDate.setMonth(dueDate.getMonth() + i);

        installments.push({
          due_date: dueDate,
          value: data.original_value,
          transaction: { id: newTransaction.id },
        });
      }

      installments.map(async (installment) => {
        const newInstallment = this.installmentRepository.create(installment);
        await this.installmentRepository.save(newInstallment);
      });
    }

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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from './entity/bank-account.entity';
import { Repository } from 'typeorm';
import { BankAccountDTO } from './dto/bank-account.dto';
import { Category } from './entity/category.entity';
import { CategoryDTO, FilterCategoryDTO } from './dto/category.dto';

@Injectable()
export class FinancialService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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
}

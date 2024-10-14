import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from './entity/bank-account.entity';
import { Repository } from 'typeorm';
import { BankAccountDTO } from './dto/bank-account.dto';

@Injectable()
export class FinancialService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
  ) {}

  async create(bankAccount: BankAccountDTO): Promise<BankAccount> {
    return await this.bankAccountRepository.save(bankAccount);
  }

  async findAll(property_id?: string): Promise<BankAccount[]> {
    return await this.bankAccountRepository.find({
      where: { property_id: property_id || undefined },
    });
  }

  async findNames(
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

  async findOne(id: string): Promise<BankAccount> {
    return await this.bankAccountRepository.findOne({ where: { id } });
  }

  async update(id: string, bankAccount: BankAccountDTO): Promise<BankAccount> {
    await this.bankAccountRepository.update(id, bankAccount);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.bankAccountRepository.delete(id);
    return { message: 'Bank Account removed successfully' };
  }
}

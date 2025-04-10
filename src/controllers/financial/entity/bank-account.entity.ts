import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  description: string;

  @Column()
  property_id: string;

  @Column()
  bank: string;

  @Column()
  agency: string;

  @Column()
  account: string;

  @Column()
  keyJ: string;

  @OneToMany(() => Transaction, (transaction) => transaction.bankAccount)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;
}

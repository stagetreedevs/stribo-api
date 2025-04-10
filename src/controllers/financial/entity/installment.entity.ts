import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

export enum InstallmentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

@Entity()
export class Installment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: number;

  @Column({ type: 'timestamp' })
  due_date: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.installments, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;

  @Column({ enum: InstallmentStatus, default: InstallmentStatus.PENDING })
  status: InstallmentStatus;
}

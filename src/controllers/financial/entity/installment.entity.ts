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

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'timestamp' })
  due_date: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.installments, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;

  @Column({ enum: InstallmentStatus, default: InstallmentStatus.PENDING })
  status: InstallmentStatus;

  @Column({ nullable: true })
  parcel: number;

  @Column({ nullable: true })
  asaas_payment_id: string;

  @Column({ nullable: true })
  bank_slip_url: string;

  @Column({ nullable: true })
  bar_code: string;

  @Column({ nullable: true })
  identification_field: string;

  @Column({ nullable: true })
  asaas_status: string;
}

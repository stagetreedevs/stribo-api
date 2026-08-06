import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillingType, PaymentStatus } from 'src/services/asaas/dto/payments.dto';

@Entity('asaas_checkout')
export class AsaasCheckout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ nullable: true })
  asaas_payment_id: string;

  @Column()
  asaas_customer_id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  value: number;

  @Column({ type: 'enum', enum: BillingType })
  billing_type: BillingType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  reference_type: string;

  @Column({ nullable: true })
  reference_id: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

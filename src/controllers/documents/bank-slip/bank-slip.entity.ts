/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export interface BankSlipInstallment {
  parcel: number;
  value: number;
  due_date: Date | string;
  status?: string;
  asaas_payment_id?: string;
  bank_slip_url?: string;
  bar_code?: string;
  identification_field?: string;
}

@Entity()
export class BankSlip {
  @PrimaryGeneratedColumn('uuid')
  ticket_number: string;

  @Column()
  property: string;

  @Column()
  provider: string;

  @Column('decimal', { precision: 12, scale: 2 })
  value: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  entry_value: number;

  @Column()
  payment: boolean;

  @Column('jsonb', { nullable: true })
  installments: BankSlipInstallment[] | null;

  @Column()
  status: string;

  @Column()
  CPF: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  asaas_customer_id: string;

  @Column({ nullable: true })
  asaas_payment_id: string;

  @Column({ nullable: true })
  asaas_installment_id: string;

  @Column({ nullable: true })
  asaas_entry_payment_id: string;

  @Column({ nullable: true })
  checkout_id: string;

  @Column({ nullable: true })
  bank_slip_url: string;

  @Column({ nullable: true })
  bar_code: string;

  @Column({ nullable: true })
  identification_field: string;

  @Column({ nullable: true })
  asaas_status: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  date: Date;

  constructor(
    property: string,
    provider: string,
    value: number,
    payment: boolean,
    installments: BankSlipInstallment[] | null,
    status: string,
    CPF: string,
    address: string,
    email: string,
    phone: string,
    date: Date,
    entry_value = 0,
    description: string = null,
  ) {
    this.ticket_number = uuidv4();
    this.property = property;
    this.CPF = CPF;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.provider = provider;
    this.value = value;
    this.entry_value = entry_value;
    this.payment = payment;
    this.installments = installments;
    this.status = status;
    this.date = date;
    this.description = description;
  }
}

/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
interface Installment {
  parcel: number;
  value: number;
  due_date: Date;
}
@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryGeneratedColumn()
  contract_number: number;

  @Column()
  property: string;

  @Column()
  title: string;

  @Column()
  event: string;

  @Column()
  animal_name: string;

  @Column()
  animal_id: string;

  @Column()
  provider: string;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column()
  payment: boolean;

  @Column('jsonb', { nullable: true })
  installments: Installment[] | null;

  @Column()
  status: string;

  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @Column()
  contract_object: string;

  @Column({ default: '' })
  pdf_url: string;

  constructor(
    property: string,
    title: string,
    event: string,
    animal_name: string,
    animal_id: string,
    provider: string,
    value: number,
    payment: boolean,
    installments: Installment[] | null,
    status: string,
    date: Date,
    contract_object: string,
    pdf_url: string,
  ) {
    this.id = uuidv4();
    this.property = property;
    this.title = title;
    this.event = event;
    this.animal_name = animal_name;
    this.animal_id = animal_id;
    this.provider = provider;
    this.value = value;
    this.payment = payment;
    this.installments = installments;
    this.status = status;
    this.date = date;
    this.contract_object = contract_object;
    this.pdf_url = pdf_url;
  }
}

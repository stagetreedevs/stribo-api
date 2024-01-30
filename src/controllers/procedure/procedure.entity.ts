/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Procedure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  property: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  hour: string;

  @Column()
  animal_id: string;

  @Column()
  animal_name: string;

  @Column()
  animal_registry: string;

  @Column()
  procedure: string;

  @Column()
  product: string;

  @Column()
  quantity: number;

  @Column({ default: '', nullable: true })
  observation: string;

  @Column({ default: 'A realizar' })
  status: string;

  @Column()
  responsible: string;

  @Column({ type: 'timestamp', nullable: true })
  regress: Date;

  @Column({ default: null, nullable: true })
  regress_quantity: number;

  @Column({ default: '', nullable: true })
  regress_observation: string;

  @Column({ default: '', nullable: true })
  regress_status: string;

  @Column({ default: '', nullable: true })
  regress_responsible: string;

  constructor(
    property: string,
    date: Date,
    hour: string,
    animal_id: string,
    animal_name: string,
    animal_registry: string,
    procedure: string,
    product: string,
    quantity: number,
    observation: string,
    status: string,
    responsible: string,
    regress: Date,
    regress_quantity: number,
    regress_observation: string,
    regress_status: string,
    regress_responsible: string
  ) {
    this.id = uuidv4();
    this.property = property;
    this.date = date;
    this.hour = hour;
    this.animal_id = animal_id;
    this.animal_name = animal_name;
    this.animal_registry = animal_registry;
    this.procedure = procedure;
    this.product = product;
    this.quantity = quantity;
    this.observation = observation;
    this.status = status;
    this.responsible = responsible;
    this.regress = regress;
    this.regress_quantity = regress_quantity;
    this.regress_observation = regress_observation;
    this.regress_status = regress_status;
    this.regress_responsible = regress_responsible;
  }
}
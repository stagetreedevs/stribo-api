import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Reproductive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  animal_id: string;

  @Column()
  animal_name: string;

  @Column()
  animal_registry: string;

  @Column({ default: '' })
  property: string;

  @Column()
  responsible: string;

  @Column()
  procedure: string;

  @Column()
  mare_type: string;

  @Column()
  situation: string;

  // status / enum "A Realizar", "Realizado", "Em atraso"
  @Column({
    enum: ['A Realizar', 'Realizado', 'Em atraso'],
    default: 'A Realizar',
    nullable: true,
  })
  status: string;

  @Column({ nullable: true })
  right_ovary: string;

  @Column({ nullable: true })
  left_ovary: string;

  @Column({ nullable: true })
  corpus_luteum: string;

  @Column({ nullable: true })
  uterine_tone: string;

  @Column({ nullable: true })
  uterine_edema: string;

  @Column({ nullable: true })
  observation: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  hour: string;

  @Column({ type: 'timestamp', nullable: true })
  regress_date: Date;

  @Column({ nullable: true })
  regress_procedure: string;

  @Column({ nullable: true })
  regress_observation: string;

  constructor(
    animal_id: string,
    accountable: string,
    procedure: string,
    property: string,
    mare_type: string,
    situation: string,
    right_ovary: string,
    left_ovary: string,
    uterine_tone: string,
    uterine_edema: string,
    observation: string,
    date: Date,
    hour: string,
    regress_date: Date,
    regress_procedure: string,
    regress_observation: string,
  ) {
    this.id = uuidv4();
    this.animal_id = animal_id;
    this.responsible = accountable;
    this.procedure = procedure;
    this.property = property;
    this.mare_type = mare_type;
    this.situation = situation;
    this.right_ovary = right_ovary;
    this.left_ovary = left_ovary;
    this.uterine_tone = uterine_tone;
    this.uterine_edema = uterine_edema;
    this.observation = observation;
    this.date = date;
    this.hour = hour;
    this.regress_date = regress_date;
    this.regress_procedure = regress_procedure;
    this.regress_observation = regress_observation;
  }
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Reproductive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  animal_id: string;

  @Column({ default: '' })
  property: string;

  @Column()
  responsible: string;

  @Column()
  procedure_name: string;

  @Column()
  mare_type: string;

  @Column()
  situation: string;

  // status / enum "A realizar", "Realizado", "Em atraso"
  @Column({
    enum: ['A realizar', 'Realizado', 'Em atraso'],
    default: 'A realizar',
    nullable: true,
  })
  status: string;

  @Column({ nullable: true })
  right_ovary: string;

  @Column({ nullable: true })
  left_ovary: string;

  @Column({ nullable: true })
  uterine_tone: string;

  @Column({ nullable: true })
  uterine_edema: string;

  @Column({ nullable: true })
  observation: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  date: Date;

  @Column({ type: 'timestamp', nullable: true })
  regress_date: Date;

  @Column({ nullable: true })
  regress_procedure_name: string;

  @Column({ nullable: true })
  regress_observation: string;

  constructor(
    animal_id: string,
    accountable: string,
    procedure_id: string,
    property: string,
    mare_type: string,
    situation: string,
    right_ovary: string,
    left_ovary: string,
    uterine_tone: string,
    uterine_edema: string,
    observation: string,
    date: Date,
    return_date: Date,
    return_procedure_id: string,
    return_observation: string,
  ) {
    this.id = uuidv4();
    this.animal_id = animal_id;
    this.responsible = accountable;
    this.procedure_name = procedure_id;
    this.property = property;
    this.mare_type = mare_type;
    this.situation = situation;
    this.right_ovary = right_ovary;
    this.left_ovary = left_ovary;
    this.uterine_tone = uterine_tone;
    this.uterine_edema = uterine_edema;
    this.observation = observation;
    this.date = date;
    this.regress_date = return_date;
    this.regress_procedure_name = return_procedure_id;
    this.regress_observation = return_observation;
  }
}

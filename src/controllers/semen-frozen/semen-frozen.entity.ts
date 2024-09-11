import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class SemenFrozen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  collection_date: Date;

  @Column()
  match_number: string;

  @Column({ default: '' })
  property: string;

  @Column()
  animal_id: string;

  @Column()
  animal_name: string;

  @Column()
  animal_registry: string;

  @Column()
  cylinder_id: string;

  @Column()
  cylinder_identifier: string;

  @Column()
  number_reeds: number;

  @Column({ nullable: true })
  observation: string;

  @Column({ nullable: true })
  motility: string;

  @Column({ nullable: true })
  vigor: string;

  @Column({ nullable: true })
  concentration: string;

  @Column({ nullable: true })
  morphology: string;

  @Column({ nullable: true })
  volume: string;

  @Column({ nullable: true })
  visual_assessment: string;

  @Column({ type: 'timestamp', nullable: true })
  shipping_date: Date;

  @Column({
    enum: ['Não enviado', 'Enviado', 'Prenhez confirmada'],
    default: 'Não enviado',
  })
  status: 'Não enviado' | 'Enviado' | 'Prenhez confirmada';

  constructor(
    collection_date: Date,
    animal_id: string,
    animal_name: string,
    cylinder_id: string,
    property: string,
    cylinder_identifier: string,
    number_reeds: number,
    observation: string,
    motility: string,
    vigor: string,
    concentration: string,
    morphology: string,
    volume: string,
    visual_assessment: string,
  ) {
    this.id = uuidv4();
    this.collection_date = collection_date;
    this.animal_id = animal_id;
    this.animal_name = animal_name;
    this.property = property;
    this.cylinder_id = cylinder_id;
    this.cylinder_identifier = cylinder_identifier;
    this.number_reeds = number_reeds;
    this.observation = observation;
    this.motility = motility;
    this.vigor = vigor;
    this.concentration = concentration;
    this.morphology = morphology;
    this.volume = volume;
    this.visual_assessment = visual_assessment;
  }
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Competition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  property: string;

  @Column()
  animal_id: string;

  @Column()
  animal_name: string;

  @Column()
  animal_registry: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  modality: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  awarded: boolean;

  @Column({ nullable: true })
  position: number;

  @Column({ nullable: true })
  prize_value: number;

  constructor(
    property: string,
    animal_id: string,
    animal_name: string,
    animal_registry: string,
    date: Date,
    modality: string,
    category: string,
    description: string,
    awarded: boolean,
    position: number,
    prize_value: number,
  ) {
    this.id = uuidv4();
    this.property = property;
    this.animal_id = animal_id;
    this.animal_name = animal_name;
    this.animal_registry = animal_registry;
    this.date = date;
    this.modality = modality;
    this.category = category;
    this.description = description;
    this.awarded = awarded;
    this.position = position;
    this.prize_value = prize_value;
  }
}

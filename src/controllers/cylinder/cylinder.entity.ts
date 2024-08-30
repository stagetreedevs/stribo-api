import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Cylinder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identifier: string;

  @Column()
  capacity: number;

  @Column({ default: '' })
  property: string;

  @Column({ default: 0 })
  stored: number;

  @Column({ nullable: true })
  animal_id: string;

  @Column({ nullable: true })
  animal_name: string;

  constructor(
    identifier: string,
    capacity: number,
    animal_id: string,
    animal_name: string,
  ) {
    this.id = uuidv4();
    this.identifier = identifier;
    this.capacity = capacity;
    this.animal_id = animal_id;
    this.animal_name = animal_name;
  }
}

import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class Cylinder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identifier: string;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  stored: number;

  @Column({ nullable: true })
  property_id: string;

  @Column({ nullable: true })
  property_name: string;

  @Column({ nullable: true })
  animal_id: string;

  @Column({ nullable: true })
  animal_name: string;

  constructor(
    identifier: string,
    capacity: number,
    property_id: string,
    property_name: string,
    animal_id: string,
    animal_name: string,
  ) {
    this.id = uuidv4();
    this.identifier = identifier;
    this.capacity = capacity;
    this.property_id = property_id;
    this.property_name = property_name;
    this.animal_id = animal_id;
    this.animal_name = animal_name;
  }
}

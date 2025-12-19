/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Breed } from './breed.entity';

@Entity('coats')
export class Coat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Breed, (breed) => breed.coats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'breed_id' })
  breed: Breed;

  @Column()
  breed_id: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  constructor(name?: string, breed?: Breed, description?: string) {
    if (name && breed) {
      this.name = name;
      this.breed = breed;
      this.breed_id = breed.id;
      this.description = description || '';
      this.active = true;
    }
  }

  @BeforeInsert()
  setTimestamps() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}

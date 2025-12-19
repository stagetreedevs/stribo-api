/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Coat } from './coat.entity';

@Entity('breeds')
export class Breed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Coat, (coat) => coat.breed)
  coats: Coat[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  constructor(name?: string, description?: string) {
    if (name) {
      this.name = name;
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

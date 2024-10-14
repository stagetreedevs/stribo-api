import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  description: string;

  @Column()
  property_id: string;

  @Column()
  bank: string;

  @Column()
  agency: string;

  @Column()
  account: string;

  @Column()
  keyJ: string;

  @CreateDateColumn()
  createdAt: Date;
}

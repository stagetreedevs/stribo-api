import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CategoryType {
  REVENUE = 'revenue',
  EXPENSE = 'expense',
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  property_id: string;

  @Column({ type: 'enum', enum: CategoryType })
  type: CategoryType;

  @Column({ unique: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}

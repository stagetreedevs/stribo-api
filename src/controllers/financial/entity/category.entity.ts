import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

export enum CategoryType {
  REVENUE = 'revenue',
  EXPENSE = 'expense',
}

export enum FieldType {
  TEXT = 'text',
  INTEGER = 'integer',
  DECIMAL = 'decimal',
  SELECT = 'select',
  ENTITY = 'entity',
  DATE = 'date',
}

export enum FieldEntity {
  ANIMAL = 'animal',
  ANIMAL_MALE = 'animal_male',
  ANIMAL_FEMALE = 'animal_female',
  COMPETITION = 'competition',
}

export class Field {
  @ApiProperty()
  label: string;

  @ApiProperty({ enum: FieldType })
  type: FieldType;

  @ApiProperty({ required: false, enum: FieldEntity })
  entity?: FieldEntity;

  @ApiProperty({ required: false, type: 'string', isArray: true })
  items?: any[];
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  property_id: string;

  @Column({ type: 'enum', enum: CategoryType })
  type: CategoryType;

  @Column({ unique: false })
  name: string;

  @Column({ type: 'jsonb' })
  fields: Field[];

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

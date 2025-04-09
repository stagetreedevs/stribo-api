import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}

export enum FieldEntity {
  ANIMAL = 'animal',
  ANIMAL_MALE = 'animal_male',
  ANIMAL_FEMALE = 'animal_female',
}

export class Field {
  @ApiProperty()
  label: string;

  @ApiProperty({ enum: FieldType })
  type: FieldType;

  @ApiProperty({ required: false, enum: FieldEntity })
  entity?: FieldEntity;

  @ApiProperty({ required: false, type: 'string', isArray: true })
  items?: string[];

  @ApiProperty({ required: false, default: false })
  is_default?: boolean;
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

  @Column({ type: 'jsonb' })
  fields: Field[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

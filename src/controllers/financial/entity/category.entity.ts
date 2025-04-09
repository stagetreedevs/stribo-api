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
  label: string;
  type: FieldType;
  entity?: FieldEntity;
  items?: string[];
  is_default: boolean;
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

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MovementsEntity } from './movements.entity';

@Entity({ name: 'products' })
export class ProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  property_id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  measurement_unit: string;

  @OneToMany(() => MovementsEntity, (movement) => movement.product, {
    onDelete: 'CASCADE',
  })
  movements: MovementsEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

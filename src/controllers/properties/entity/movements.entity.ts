import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { Animal } from '../../animal/animal.entity';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('movements')
export class MovementsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @ManyToOne(() => ProductsEntity, (product) => product.movements, {
    onDelete: 'CASCADE',
  })
  product: ProductsEntity;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Animal, (animal) => animal.movements, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  animal: Animal;

  @Column({ default: '' })
  description: string;
}

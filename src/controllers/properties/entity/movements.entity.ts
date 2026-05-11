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

  @Column()
  property_id: string;

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

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: {
      to: (v: number | null | undefined) => (v === undefined ? null : v),
      from: (v: string | null) => (v === null ? null : parseFloat(v)),
    },
  })
  value: number;

  @Column({ default: '' })
  invoice_attachment: string;
}

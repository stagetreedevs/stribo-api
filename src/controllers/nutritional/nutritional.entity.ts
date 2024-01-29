/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Nutritional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  animal_id: string;

  @Column()
  product: string;

  @Column()
  quantity: number;

  constructor(
    animal_id: string,
    product: string,
    quantity: number
  ) {
    this.id = uuidv4();
    this.animal_id = animal_id;
    this.product = product;
    this.quantity = quantity;
  }
}

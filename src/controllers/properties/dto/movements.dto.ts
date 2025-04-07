import { MovementType } from '../entity/movements.entity';

export class MovementsDTO {
  type: MovementType;
  datetime: Date;
  product_id: string;
  quantity: number;
  animal_id: string;
  description: string;
}

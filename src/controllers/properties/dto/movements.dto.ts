import { MovementType } from '../entity/movements.entity';

export class MovementsDTO {
  type: MovementType;
  datetime: Date;
  product_id: string;
  quantity: number;
  animal_id: string;
  description: string;
}

export class MovementsQueryDTO {
  start_date?: Date;
  end_date?: Date;
  category?: string;
  type?: MovementType;
  start_quantity?: number;
  end_quantity?: number;
  order_by?: 'datetime' | 'product' | 'animal';
  order?: 'ASC' | 'DESC';
}

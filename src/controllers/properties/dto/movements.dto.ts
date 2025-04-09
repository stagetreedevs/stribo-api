import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '../entity/movements.entity';

export class MovementsDTO {
  @ApiProperty()
  property_id: string;

  @ApiProperty({ enum: MovementType })
  type: MovementType;

  @ApiProperty()
  datetime: Date;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  animal_id: string;

  @ApiProperty()
  description: string;
}

export class MovementsQueryDTO {
  @ApiProperty({ required: false })
  start_date?: Date;

  @ApiProperty({ required: false })
  end_date?: Date;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  type?: MovementType;

  @ApiProperty({ required: false })
  start_quantity?: number;

  @ApiProperty({ required: false })
  end_quantity?: number;

  @ApiProperty({ required: false, enum: ['datetime', 'product', 'animal'] })
  order_by?: 'datetime' | 'product' | 'animal';

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  order?: 'ASC' | 'DESC';
}

import { ApiProperty } from '@nestjs/swagger';

export class ProductsDTO {
  @ApiProperty()
  property_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  measurement_unit: string;
}

export class ProductsQueryDTO {
  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  measurement_unit?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  order?: 'ASC' | 'DESC';

  @ApiProperty({
    required: false,
    enum: ['name', 'category', 'measurement_unit'],
  })
  order_by?: 'name' | 'category' | 'measurement_unit';
}

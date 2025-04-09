import { ApiProperty } from '@nestjs/swagger';
import { CategoryType, Field } from '../entity/category.entity';

export class CategoryDTO {
  @ApiProperty()
  property_id: string;

  @ApiProperty({ enum: CategoryType })
  type: CategoryType;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: Field, isArray: true })
  fields: Field[];
}

export class FilterCategoryDTO {
  @ApiProperty({ required: false })
  property_id: string;

  @ApiProperty({ required: false, enum: CategoryType })
  type: CategoryType;
}

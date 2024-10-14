import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '../entity/category.entity';

export class CategoryDTO {
  @ApiProperty()
  property_id: string;

  @ApiProperty({ enum: CategoryType })
  type: CategoryType;

  @ApiProperty()
  name: string;
}

export class FilterCategoryDTO {
  @ApiProperty({ required: false })
  property_id: string;

  @ApiProperty({ required: false, enum: CategoryType })
  type: CategoryType;
}

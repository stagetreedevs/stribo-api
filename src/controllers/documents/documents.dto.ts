/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class FilterDocumentsDto {
  @ApiProperty({ required: false })
  initialDate?: Date;

  @ApiProperty({ required: false })
  lastDate?: Date;

  @ApiProperty({ required: false })
  provider: string;

  @ApiProperty({ required: false })
  animal_name?: string;

  @ApiProperty({ required: false })
  event?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  order?: 'ASC' | 'DESC';
}

import { ApiProperty } from '@nestjs/swagger';

export class SemenFrozenDto {
  @ApiProperty()
  collection_date: Date;

  @ApiProperty()
  animal_id: string;

  @ApiProperty()
  animal_name: string;

  @ApiProperty()
  cylinder_id: string;

  @ApiProperty()
  cylinder_identifier: string;

  @ApiProperty()
  number_reeds: number;

  @ApiProperty({ required: false })
  observation: string;

  @ApiProperty({ required: false })
  motility: string;

  @ApiProperty({ required: false })
  vigor: string;

  @ApiProperty({ required: false })
  concentration: string;

  @ApiProperty({ required: false })
  morphology: string;

  @ApiProperty({ required: false })
  volume: string;

  @ApiProperty({ required: false })
  visual_assessment: string;
}

export class FilterSemenFrozen {
  @ApiProperty({ required: false })
  start_date?: Date;

  @ApiProperty({ required: false })
  end_date?: Date;

  @ApiProperty({ required: false })
  cylinder_id?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
  order?: 'ASC' | 'DESC';

  @ApiProperty({
    required: false,
    enum: ['storages', 'animals'],
    default: 'storages',
  })
  layout?: 'storages' | 'animals' | null;
}

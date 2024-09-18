import { ApiProperty } from '@nestjs/swagger';

export class CreateCompetitionDto {
  @ApiProperty()
  property: string;

  @ApiProperty()
  animal_id: string;

  @ApiProperty()
  animal_name: string;

  @ApiProperty()
  animal_registry: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  modality: string;

  @ApiProperty({ required: false })
  category: string;

  @ApiProperty({ required: false })
  description: string;
}

export class UpdateCompetitionDto {
  @ApiProperty({ required: false })
  animal_id: string;

  @ApiProperty({ required: false })
  animal_name: string;

  @ApiProperty({ required: false })
  animal_registry: string;

  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  date: Date;

  @ApiProperty({ required: false })
  modality: string;

  @ApiProperty({ required: false })
  category: string;

  @ApiProperty({ required: false })
  description: string;
}

export class UpdateAwardDto {
  @ApiProperty()
  awarded: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  prize_value: number;
}

export class FilterCompetitionDto {
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
  order?: 'ASC' | 'DESC';

  @ApiProperty({ required: false })
  animal_id?: string;

  @ApiProperty({ required: false })
  initialDate?: Date;

  @ApiProperty({ required: false })
  lastDate?: Date;

  @ApiProperty({ required: false })
  modality?: string;

  @ApiProperty({ required: false })
  category?: string;
}

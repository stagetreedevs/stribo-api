import { ApiProperty } from '@nestjs/swagger';

export class ReproductiveDto {
  @ApiProperty()
  animal_id: string;

  @ApiProperty()
  responsible: string;

  @ApiProperty()
  procedure_name: string;

  @ApiProperty()
  mare_type: string;

  @ApiProperty()
  situation: string;

  @ApiProperty({
    enum: ['A realizar', 'Realizado', 'Em atraso'],
    required: false,
  })
  status: string;

  @ApiProperty({ required: false })
  right_ovary: string;

  @ApiProperty({ required: false })
  left_ovary: string;

  @ApiProperty({ required: false })
  uterine_tone: string;

  @ApiProperty({ required: false })
  uterine_edema: string;

  @ApiProperty({ required: false })
  observation: string;

  @ApiProperty({ type: Date, required: false })
  date: Date;

  @ApiProperty({ type: Date, required: false })
  regress_date: Date;

  @ApiProperty({ required: false })
  regress_procedure_name: string;

  @ApiProperty({ required: false })
  regress_observation: string;
}

export class UpdateReproductiveDto {
  @ApiProperty({ required: false })
  animal_id: string;

  @ApiProperty({ required: false })
  responsible: string;

  @ApiProperty({ required: false })
  procedure_name: string;

  @ApiProperty({ required: false })
  mare_type: string;

  @ApiProperty({ required: false })
  situation: string;

  @ApiProperty({
    enum: ['A realizar', 'Realizado', 'Em atraso'],
    required: false,
  })
  status: string;

  @ApiProperty({ required: false })
  right_ovary: string;

  @ApiProperty({ required: false })
  left_ovary: string;

  @ApiProperty({ required: false })
  uterine_tone: string;

  @ApiProperty({ required: false })
  uterine_edema: string;

  @ApiProperty({ required: false })
  observation: string;

  @ApiProperty({ type: Date, required: false })
  date: Date;

  @ApiProperty({ type: Date, required: false })
  regress_date: Date;

  @ApiProperty({ required: false })
  regress_procedure_name: string;

  @ApiProperty({ required: false })
  regress_observation: string;
}

export class FilterReproductiveDto {
  @ApiProperty({ required: false })
  procedure_name: string;

  @ApiProperty({ required: false })
  responsible: string;

  @ApiProperty({ type: Date, required: false })
  start_date: Date;

  @ApiProperty({ type: Date, required: false })
  end_date: Date;

  @ApiProperty({ required: false })
  status: string;

  @ApiProperty({ required: false })
  order: 'ASC' | 'DESC';
}

export class SearchByDateDto {
  @ApiProperty({ required: false })
  layout: 'procedures' | 'animals';
}

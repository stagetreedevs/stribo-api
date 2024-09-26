import { ApiProperty } from '@nestjs/swagger';

export class ReproductiveDto {
  @ApiProperty()
  animal_id: string;

  @ApiProperty()
  animal_name: string;

  @ApiProperty()
  animal_registry: string;

  @ApiProperty()
  property: string;

  @ApiProperty()
  responsible: string;

  @ApiProperty()
  procedure: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  hour: string;

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
  regress_date: Date;

  @ApiProperty({ required: false })
  regress_procedure: string;

  @ApiProperty({ required: false })
  regress_observation: string;
}

export class UpdateReproductiveDto {
  @ApiProperty()
  animal_id: string;

  @ApiProperty()
  animal_name: string;

  @ApiProperty()
  animal_registry: string;

  @ApiProperty({ required: false })
  responsible: string;

  @ApiProperty({ required: false })
  property: string;

  @ApiProperty({ required: false })
  procedure: string;

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

  @ApiProperty()
  date: Date;

  @ApiProperty()
  hour: string;

  @ApiProperty({ type: Date, required: false })
  regress_date: Date;

  @ApiProperty({ required: false })
  regress_procedure: string;

  @ApiProperty({ required: false })
  regress_observation: string;
}

export class FilterProcedureDto {
  @ApiProperty({ default: 'ASC' })
  order?: 'ASC' | 'DESC';

  @ApiProperty({ required: false })
  procedure?: string;

  @ApiProperty({ required: false })
  responsible?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  initialDate?: Date;

  @ApiProperty({ required: false })
  lastDate?: Date;
}

export class ProcedureStatusDto {
  @ApiProperty()
  status: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class ReproductiveDto {
  @ApiProperty()
  animal_id: string;

  @ApiProperty()
  accountable: string;

  @ApiProperty()
  procedure_id: string;

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
  return_date: Date;

  @ApiProperty({ required: false })
  return_procedure_id: string;

  @ApiProperty({ required: false })
  return_observation: string;
}

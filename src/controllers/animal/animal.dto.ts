/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class AnimalDto {
  @ApiProperty()
  owner: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  race: string;

  @ApiProperty()
  coat: string;

  @ApiProperty()
  registerNumber: string;

  @ApiProperty({ required: false })
  property: string;

  @ApiProperty()
  sex: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  photo: string;

  @ApiProperty({ required: false })
  occupation: string;

  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  castrated: boolean;

  @ApiProperty({ required: false })
  sale: string;

  @ApiProperty({ required: false })
  value: string;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  birthDate: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? new Date(value) : null))
  castrationDate: string;

  @ApiProperty({ required: false })
  father: string;

  @ApiProperty({ required: false })
  father_id: string;

  @ApiProperty({ required: false })
  mother: string;

  @ApiProperty({ required: false })
  mother_id: string;
}

export class UpdateAnimalDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  race: string;

  @ApiProperty({ required: false })
  coat: string;

  @ApiProperty({ required: false })
  registerNumber: string;

  @ApiProperty({ required: false })
  property: string;

  @ApiProperty({ required: false })
  sex: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  photo: string;

  @ApiProperty({ required: false })
  occupation: string;

  @ApiProperty({ required: false })
  castrated: boolean;

  @ApiProperty({ required: false })
  sale: string;

  @ApiProperty({ required: false })
  value: string;

  @ApiProperty({ required: false })
  birthDate: string;

  @ApiProperty({ required: false })
  castrationDate: string;

  @ApiProperty({ required: false })
  father: string;

  @ApiProperty({ required: false })
  father_id: string;

  @ApiProperty({ required: false })
  mother: string;

  @ApiProperty({ required: false })
  mother_id: string;
}

export class FilterAnimalDto {
  @ApiProperty({ default: 'ASC' })
  order?: string;

  @ApiProperty({ required: false })
  owner?: string;

  @ApiProperty({ required: false })
  initialDate?: Date;

  @ApiProperty({ required: false })
  lastDate?: Date;

  @ApiProperty({ required: false })
  race?: string;

  @ApiProperty({ required: false })
  coat?: string;

  @ApiProperty({ required: false })
  sex?: string;

  @ApiProperty({ required: false })
  live?: boolean;

  @ApiProperty({ required: false })
  nutritional?: string;
}

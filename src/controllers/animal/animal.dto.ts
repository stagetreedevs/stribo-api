/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class AnimalDto {
  @ApiProperty()
  owner: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  breed_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  coat_id: string;

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
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  breed_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  coat_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  registerNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  property: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sex: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  photo: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  occupation: string;

  @ApiProperty({ required: false })
  @IsOptional()
  castrated: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sale: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  value: string;

  @ApiProperty({ required: false })
  @IsOptional()
  birthDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  castrationDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  father: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  father_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mother: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mother_id: string;
}

export class BreedDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;
}

export class CoatDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  breed_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;
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
  breed_id?: string;

  @ApiProperty({ required: false })
  coat_id?: string;

  @ApiProperty({ required: false })
  sex?: string;

  @ApiProperty({ required: false })
  live?: boolean;

  @ApiProperty({ required: false })
  nutritional?: string;
}

import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum PersonType {
  JURIDICA = 'JURIDICA',
  FISICA = 'FISICA',
}

export class Costumer {
  id: string;
  dateCreated: string;
  name: string;
  email: string;
  phone: string;
  mobilePhone: string;
  address: string;
  addressNumber: string;
  complement: string;
  province: string;
  city: string;
  cityName: string;
  state: string;
  country: string;
  postalCode: string;
  cpfCnpj: string;
  personType: PersonType;
  deleted: boolean;
  additionalEmails: string;
  externalReference: string;
  notificationDisabled: boolean;
  observations: string;
  foreignCustomer: boolean;
}

export class CreateCostumerDto extends PartialType(
  OmitType(Costumer, [
    'id',
    'dateCreated',
    'deleted',
    'city',
    'cityName',
    'state',
    'country',
  ]),
) {
  @ApiProperty({ example: '12345678901' })
  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '11999999999', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '11999999999', required: false })
  @IsString()
  @IsOptional()
  mobilePhone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  addressNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  externalReference?: string;
}

export class UpdateCostumerDto extends PartialType(CreateCostumerDto) {}

export class SyncCustomerDto extends CreateCostumerDto {}

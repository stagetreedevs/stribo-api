/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class BankSlipDto {
  @ApiProperty()
  property: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  value: number;

  @ApiProperty({
    required: false,
    description: 'Valor de entrada. Se omitido, assume 0.',
    default: 0,
  })
  entry_value?: number;

  @ApiProperty({
    description: 'true = à vista | false = parcelado',
  })
  payment: boolean;

  @ApiProperty({ required: false })
  installments?: any[] | null;

  @ApiProperty({ required: false, default: 'Vigente' })
  status?: string;

  @ApiProperty()
  CPF: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  date?: Date;
}

export class BankSlipEditDto {
  @ApiProperty({ required: false })
  provider?: string;

  @ApiProperty({ required: false })
  value?: number;

  @ApiProperty({ required: false })
  entry_value?: number;

  @ApiProperty({ required: false })
  payment?: boolean;

  @ApiProperty({ required: false })
  installments?: any[] | null;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  CPF?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  description?: string;
}

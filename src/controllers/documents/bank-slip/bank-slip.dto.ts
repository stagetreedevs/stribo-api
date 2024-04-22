/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class BankSlipDto {
    @ApiProperty()
    property: string;

    @ApiProperty()
    provider: string;

    @ApiProperty()
    value: number;

    @ApiProperty()
    payment: boolean;

    @ApiProperty()
    installments: any[] | null;

    @ApiProperty()
    status: string;

    @ApiProperty()
    CPF: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;
}

export class BankSlipEditDto {
    @ApiProperty()
    provider: string;

    @ApiProperty()
    value: number;

    @ApiProperty()
    payment: boolean;

    @ApiProperty()
    installments: any[] | null;

    @ApiProperty()
    status: string;

    @ApiProperty()
    CPF: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;
}
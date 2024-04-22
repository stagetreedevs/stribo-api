/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class InvoiceDto {
    @ApiProperty()
    property: string;

    @ApiProperty()
    provider: string;

    @ApiProperty()
    CPF: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    value: number;

    @ApiProperty()
    description: string;
}

export class InvoiceEditDto {
    @ApiProperty()
    provider: string;

    @ApiProperty()
    CPF: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    value: number;

    @ApiProperty()
    description: string;
}
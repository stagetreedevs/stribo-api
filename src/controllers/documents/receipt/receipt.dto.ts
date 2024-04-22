/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class ReceiptDto {
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

    @ApiProperty()
    date: Date;
}

export class ReceiptEditDto {
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

    @ApiProperty()
    date: Date;
}
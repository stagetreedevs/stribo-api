/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class BudgetDto {
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
    status: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    date: Date;
}

export class BudgetEditDto {
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
    status: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    date: Date;
}
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class ContractDto {
    @ApiProperty()
    property: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    event: string;

    @ApiProperty()
    animal_name: string;

    @ApiProperty()
    animal_id: string;

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
    date: Date;

    @ApiProperty()
    contract_object: string;
}

export class ContractEditDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    event: string;

    @ApiProperty()
    animal_name: string;

    @ApiProperty()
    animal_id: string;

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
    date: Date;

    @ApiProperty()
    contract_object: string;
}
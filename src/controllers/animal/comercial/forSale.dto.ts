/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class ForSaleDto {
    @ApiProperty()
    animal: string;

    @ApiProperty()
    value: number;
}

export class ForSaleEditDto {
    @ApiProperty()
    value: number;

    @ApiProperty()
    payment: boolean;

    @ApiProperty()
    installments: any[] | null;
}

export class FilterAnimalForSale {
    @ApiProperty({ default: 'ASC' })
    order?: string;

    @ApiProperty({ required: false })
    initialDate?: Date;

    @ApiProperty({ required: false })
    lastDate?: Date;
}
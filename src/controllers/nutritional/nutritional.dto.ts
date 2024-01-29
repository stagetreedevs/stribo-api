/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class NutritionalDto {
    @ApiProperty()
    animal_id: string;

    @ApiProperty()
    product: string;

    @ApiProperty()
    quantity: number;
}
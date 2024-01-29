/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class BiometryDto {
    @ApiProperty()
    animal_id: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    weight: number;

    @ApiProperty()
    height: number;
}
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class AnimalDto {
    @ApiProperty()
    owner: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    race: string;

    @ApiProperty()
    coat: string;

    @ApiProperty()
    registerNumber: string;

    @ApiProperty({ required: false })
    property: string;

    @ApiProperty()
    sex: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    photo: string;

    @ApiProperty({ required: false })
    occupation: string;

    @ApiProperty()
    register: boolean;

    @ApiProperty({ required: false })
    sale: string;

    @ApiProperty({ required: false })
    value: string;

    @ApiProperty({ required: false })
    birthDate: string;

    @ApiProperty({ required: false })
    castrationDate: string;

    @ApiProperty({ required: false })
    father: string;

    @ApiProperty({ required: false })
    mother: string;
}
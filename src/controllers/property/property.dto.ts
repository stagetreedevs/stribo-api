/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class PropertyDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ required: false })
    code: string;

    @ApiProperty()
    owner: string;
}
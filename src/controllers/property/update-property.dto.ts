/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class UpdatePropertyDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ required: false })
    code: string;
}
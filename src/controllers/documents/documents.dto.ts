/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class FilterDocumentsDto {
    @ApiProperty({ required: false })
    initialDate?: Date;

    @ApiProperty({ required: false })
    lastDate?: Date;

    @ApiProperty()
    provider: string;

    @ApiProperty({ default: 'ASC' })
    order?: string;
}
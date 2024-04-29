/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class AnimalDocumentDto {
    @ApiProperty()
    animal: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: string;
}
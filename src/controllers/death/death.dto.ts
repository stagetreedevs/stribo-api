/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class DeathDto {
    @ApiProperty()
    animal_id: string;

    @ApiProperty()
    dateDeath: Date;

    @ApiProperty()
    reason: string;
}
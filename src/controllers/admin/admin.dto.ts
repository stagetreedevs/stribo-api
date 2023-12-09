/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class AdminDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    cpf: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    role: string;
}
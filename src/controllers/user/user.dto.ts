/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class UserDto {
    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    profile: string;

    @ApiProperty()
    cpf: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}
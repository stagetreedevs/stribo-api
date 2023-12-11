/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class UpdateAdminDto {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    username: string;

    @ApiProperty({ required: false })
    cpf: string;

    @ApiProperty({ required: false })
    phone: string;

    @ApiProperty({ required: false })
    role: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    image?: Express.Multer.File;
}

export class UpdateAdminFirstLoginDto {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    newPassword: string;
}

export class UpdatePasswordDto {
    @ApiProperty() newPassword: string;
}
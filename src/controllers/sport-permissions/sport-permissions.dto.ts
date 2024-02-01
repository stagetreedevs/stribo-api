/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

interface Permissions {
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

export class SportPermissionsDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    evento: Permissions;

    @ApiProperty()
    competicoes: Permissions;

    @ApiProperty()
    animal: Permissions;
}

export class SportPermissionsEditDto {
    @ApiProperty()
    evento: Permissions;

    @ApiProperty()
    competicoes: Permissions;

    @ApiProperty()
    animal: Permissions;
}
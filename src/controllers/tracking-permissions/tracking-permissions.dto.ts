/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

interface Permissions {
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

export class TrackingPermissionsDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    marcacoes: Permissions;

    @ApiProperty()
    medidas: Permissions;
}

export class TrackingPermissionsEditDto {
    @ApiProperty()
    marcacoes: Permissions;

    @ApiProperty()
    medidas: Permissions;
}
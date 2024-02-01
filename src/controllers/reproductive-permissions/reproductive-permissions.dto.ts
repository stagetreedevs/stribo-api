/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

interface Permissions {
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

export class ReproductivePermissionsDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    genealogia: Permissions;

    @ApiProperty()
    inseminação: Permissions;

    @ApiProperty()
    prenhes: Permissions;
}

export class ReproductivePermissionsEditDto {
    @ApiProperty()
    genealogia: Permissions;

    @ApiProperty()
    inseminação: Permissions;

    @ApiProperty()
    prenhes: Permissions;
}
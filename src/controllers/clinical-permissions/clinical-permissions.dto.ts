/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

interface Permissions {
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

export class ClinicalPermissionsDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    nutricional: Permissions;

    @ApiProperty()
    vermifugacao: Permissions;

    @ApiProperty()
    vacinas: Permissions;

    @ApiProperty()
    procedimentos: Permissions;

    @ApiProperty()
    ferregeamento: Permissions;

    @ApiProperty()
    exames: Permissions;
}

export class ClinicalPermissionsEditDto {
    @ApiProperty()
    nutricional: Permissions;

    @ApiProperty()
    vermifugacao: Permissions;

    @ApiProperty()
    vacinas: Permissions;

    @ApiProperty()
    procedimentos: Permissions;

    @ApiProperty()
    ferregeamento: Permissions;

    @ApiProperty()
    exames: Permissions;
}
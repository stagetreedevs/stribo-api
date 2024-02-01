/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

interface Permissions {
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

export class PurchasesPermissionsDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    itens: Permissions;

    @ApiProperty()
    orcamentos: Permissions;

    @ApiProperty()
    parcelas: Permissions;

    @ApiProperty()
    notas: Permissions;

    @ApiProperty()
    estoque: Permissions;
}

export class PurchasesPermissionsEditDto {
    @ApiProperty()
    itens: Permissions;

    @ApiProperty()
    orcamentos: Permissions;

    @ApiProperty()
    parcelas: Permissions;

    @ApiProperty()
    notas: Permissions;

    @ApiProperty()
    estoque: Permissions;
}
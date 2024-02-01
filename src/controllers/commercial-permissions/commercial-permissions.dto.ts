/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

interface Permissions {
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

export class CommercialPermissionsDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    contratos: Permissions;

    @ApiProperty()
    vendas: Permissions;

    @ApiProperty()
    orcamentos: Permissions;

    @ApiProperty()
    notas: Permissions;

    @ApiProperty()
    recibos: Permissions;

    @ApiProperty()
    servico: Permissions;

    @ApiProperty()
    produtos: Permissions;

    @ApiProperty()
    estoque: Permissions;

    @ApiProperty()
    inventario: Permissions;
}

export class CommercialPermissionsEditDto {
    @ApiProperty()
    contratos: Permissions;

    @ApiProperty()
    vendas: Permissions;

    @ApiProperty()
    orcamentos: Permissions;

    @ApiProperty()
    notas: Permissions;

    @ApiProperty()
    recibos: Permissions;

    @ApiProperty()
    servico: Permissions;

    @ApiProperty()
    produtos: Permissions;

    @ApiProperty()
    estoque: Permissions;

    @ApiProperty()
    inventario: Permissions;
}
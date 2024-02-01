/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

interface Permissions {
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

export class RegistrationPermissionsDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    clientes: Permissions;

    @ApiProperty()
    fornecedores: Permissions;

    @ApiProperty()
    planos: Permissions;

    @ApiProperty()
    animal: Permissions;

    @ApiProperty()
    propriedade: Permissions;
}

export class RegistrationPermissionsEditDto {
    @ApiProperty()
    clientes: Permissions;

    @ApiProperty()
    fornecedores: Permissions;

    @ApiProperty()
    planos: Permissions;

    @ApiProperty()
    animal: Permissions;

    @ApiProperty()
    propriedade: Permissions;
}
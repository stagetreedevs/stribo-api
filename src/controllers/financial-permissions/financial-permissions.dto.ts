/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

interface Permissions {
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}

export class FinancialPermissionsDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    caixa: Permissions;

    @ApiProperty()
    graficos: Permissions;
}

export class FinancialPermissionsEditDto {
    @ApiProperty()
    caixa: Permissions;

    @ApiProperty()
    graficos: Permissions;
}
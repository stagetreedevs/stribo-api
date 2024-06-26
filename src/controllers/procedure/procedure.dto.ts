/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class ProcedureDto {
    @ApiProperty()
    date: Date;

    @ApiProperty()
    hour: string;

    @ApiProperty()
    property: string;

    @ApiProperty()
    animal_id: string;

    @ApiProperty()
    animal_name: string;

    @ApiProperty()
    animal_registry: string;

    @ApiProperty()
    procedure: string;

    @ApiProperty()
    product: string;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    observation: string;

    @ApiProperty()
    responsible: string;

    @ApiProperty()
    regress: Date;

    @ApiProperty()
    regress_quantity: number;

    @ApiProperty()
    regress_observation: string;

    @ApiProperty()
    regress_status: string;

    @ApiProperty()
    regress_responsible: string;

    @ApiProperty()
    regress_procedure: string;

    @ApiProperty()
    regress_product: string;
}

export class ProcedureEditDto {
    @ApiProperty()
    date: Date;

    @ApiProperty()
    hour: string;

    @ApiProperty()
    animal_id: string;

    @ApiProperty()
    animal_name: string;

    @ApiProperty()
    animal_registry: string;

    @ApiProperty()
    procedure: string;

    @ApiProperty()
    product: string;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    observation: string;

    @ApiProperty()
    responsible: string;

    @ApiProperty()
    regress: Date;

    @ApiProperty()
    regress_quantity: number;

    @ApiProperty()
    regress_observation: string;

    @ApiProperty()
    regress_status: string;

    @ApiProperty()
    regress_responsible: string;

    @ApiProperty()
    regress_procedure: string;

    @ApiProperty()
    regress_product: string;
}

export class FilterProcedureDto {
    @ApiProperty({ default: 'ASC' })
    order?: string;

    @ApiProperty({ required: false })
    procedure?: string;

    @ApiProperty({ required: false })
    responsible?: string;

    @ApiProperty({ required: false })
    status?: string;

    @ApiProperty({ required: false })
    initialDate?: Date;

    @ApiProperty({ required: false })
    lastDate?: Date;
}

export class ProcedureStatusDto {
    @ApiProperty()
    status: string;
}
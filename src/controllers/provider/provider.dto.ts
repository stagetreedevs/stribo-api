/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

interface ProviderAdress {
    country: string;
    cep: string;
    streetAddress: string;
    numberAddress: number | null;
    complement: string;
    district: string;
    city: string;
    state: string;
    description: string;
    main: boolean | null;
};
interface ProviderBank {
    name: string;
    account: string;
    agency: string;
};
interface ProviderContact {
    name: string;
    phone: string;
    obs: string;
};

export class ProviderDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    provider: string;

    @ApiProperty()
    personType: string;

    @ApiProperty()
    cpf: string;

    @ApiProperty()
    registerCode: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    prefixPersonalPhone: string;

    @ApiProperty()
    personalPhone: string;

    @ApiProperty()
    prefixComercialPhone: string;

    @ApiProperty()
    comercialPhone: string;

    @ApiProperty()
    birthDate: string;

    @ApiProperty()
    rg: string;

    @ApiProperty()
    stateRegistrationIndicator: string;

    @ApiProperty()
    stateRegistration: string;

    @ApiProperty()
    genearalObs: string;

    @ApiProperty()
    adress: ProviderAdress[];

    @ApiProperty()
    contacts: ProviderContact[];

    @ApiProperty()
    banks: ProviderBank[];
}

export class ProviderEditDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    provider: string;

    @ApiProperty()
    personType: string;

    @ApiProperty()
    cpf: string;

    @ApiProperty()
    registerCode: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    prefixPersonalPhone: string;

    @ApiProperty()
    personalPhone: string;

    @ApiProperty()
    prefixComercialPhone: string;

    @ApiProperty()
    comercialPhone: string;

    @ApiProperty()
    birthDate: string;

    @ApiProperty()
    rg: string;

    @ApiProperty()
    stateRegistrationIndicator: string;

    @ApiProperty()
    stateRegistration: string;

    @ApiProperty()
    genearalObs: string;

    @ApiProperty()
    adress: ProviderAdress[];

    @ApiProperty()
    contacts: ProviderContact[];

    @ApiProperty()
    banks: ProviderBank[];
}

export class FilterProviderDto {
    @ApiProperty()
    order?: string;

    @ApiProperty({ required: false })
    name?: string;

    @ApiProperty({ required: false })
    type?: string;

    @ApiProperty({ required: false })
    initialDate?: Date;

    @ApiProperty({ required: false })
    lastDate?: Date;
}
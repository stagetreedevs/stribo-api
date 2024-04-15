/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
interface ProviderAdress {
    streetAddress: string;
    numberAddress: number;
    main: boolean;
};
interface ProviderBank {
    name: string;
    account: string;
    agency: string;
};
interface ProviderContact {
    name: string;
    obs: string;
};
@Entity()
export class Provider {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Column()
    property: string;

    @Column()
    name: string;

    @Column()
    provider: string;

    @Column()
    personType: string;

    @Column()
    cpf: string;

    @Column()
    registerCode: string;

    @Column()
    email: string;

    @Column()
    prefixPersonalPhone: string;

    @Column()
    personalPhone: string;

    @Column()
    prefixComercialPhone: string;

    @Column()
    comercialPhone: string;

    @Column()
    birthDate: string;

    @Column()
    rg: string;

    @Column()
    stateRegistrationIndicator: string;

    @Column()
    stateRegistration: string;

    @Column()
    genearalObs: string;

    @Column('jsonb')
    adress: ProviderAdress[];

    @Column('jsonb')
    contacts: ProviderContact[];

    @Column('jsonb')
    banks: ProviderBank[];

    @Column({ type: 'date', default: () => 'now()' })
    createdAt: Date;

    constructor(
        type: string,
        property: string,
        name: string,
        provider: string,
        personType: string,
        cpf: string,
        registerCode: string,
        email: string,
        prefixPersonalPhone: string,
        personalPhone: string,
        prefixComercialPhone: string,
        comercialPhone: string,
        birthDate: string,
        rg: string,
        stateRegistrationIndicator: string,
        stateRegistration: string,
        genearalObs: string,
        adress: ProviderAdress[],
        contacts: ProviderContact[],
        banks: ProviderBank[],
        createdAt: Date,
    ) {
        this.id = uuidv4();
        this.type = type;
        this.property = property;
        this.name = name;
        this.provider = provider;
        this.personType = personType;
        this.cpf = cpf;
        this.registerCode = registerCode;
        this.email = email;
        this.prefixPersonalPhone = prefixPersonalPhone;
        this.personalPhone = personalPhone;
        this.prefixComercialPhone = prefixComercialPhone;
        this.comercialPhone = comercialPhone;
        this.birthDate = birthDate;
        this.rg = rg;
        this.stateRegistrationIndicator = stateRegistrationIndicator;
        this.stateRegistration = stateRegistration;
        this.genearalObs = genearalObs;
        this.adress = adress;
        this.contacts = contacts;
        this.banks = banks;
        this.createdAt = createdAt;
    }
}
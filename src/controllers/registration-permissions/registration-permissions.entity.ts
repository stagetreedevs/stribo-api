/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
interface Permissions {
    name: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
}
@Entity()
export class RegistrationPermissions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column('jsonb')
    clientes: Permissions;

    @Column('jsonb')
    fornecedores: Permissions;

    @Column('jsonb')
    planos: Permissions;

    @Column('jsonb')
    animal: Permissions;

    @Column('jsonb')
    propriedade: Permissions;

    constructor(
        username: string,
        clientes: Permissions,
        fornecedores: Permissions,
        planos: Permissions,
        animal: Permissions,
        propriedade: Permissions
    ) {
        this.id = uuidv4();
        this.username = username;
        this.clientes = clientes;
        this.fornecedores = fornecedores;
        this.planos = planos;
        this.animal = animal;
        this.propriedade = propriedade;
    }
}
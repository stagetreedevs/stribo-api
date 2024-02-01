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
export class PurchasesPermissions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column('jsonb')
    itens: Permissions;

    @Column('jsonb')
    orcamentos: Permissions;

    @Column('jsonb')
    parcelas: Permissions;

    @Column('jsonb')
    notas: Permissions;

    @Column('jsonb')
    estoque: Permissions;

    constructor(
        username: string,
        itens: Permissions,
        orcamentos: Permissions,
        parcelas: Permissions,
        notas: Permissions,
        estoque: Permissions
    ) {
        this.id = uuidv4();
        this.username = username;
        this.itens = itens;
        this.orcamentos = orcamentos;
        this.parcelas = parcelas;
        this.notas = notas;
        this.estoque = estoque;
    }
}
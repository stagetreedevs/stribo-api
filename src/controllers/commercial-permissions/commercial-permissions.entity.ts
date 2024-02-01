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
export class CommercialPermissions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column('jsonb')
    contratos: Permissions;

    @Column('jsonb')
    vendas: Permissions;

    @Column('jsonb')
    orcamentos: Permissions;

    @Column('jsonb')
    notas: Permissions;

    @Column('jsonb')
    recibos: Permissions;

    @Column('jsonb')
    servico: Permissions;

    @Column('jsonb')
    produtos: Permissions;

    @Column('jsonb')
    estoque: Permissions;

    @Column('jsonb')
    inventario: Permissions;

    constructor(
        username: string,
        contratos: Permissions,
        vendas: Permissions,
        orcamentos: Permissions,
        notas: Permissions,
        recibos: Permissions,
        servico: Permissions,
        produtos: Permissions,
        estoque: Permissions,
        inventario: Permissions,

    ) {
        this.id = uuidv4();
        this.username = username;
        this.contratos = contratos;
        this.vendas = vendas;
        this.orcamentos = orcamentos;
        this.notas = notas;
        this.recibos = recibos;
        this.servico = servico;
        this.produtos = produtos;
        this.estoque = estoque;
        this.inventario = inventario;
    }
}
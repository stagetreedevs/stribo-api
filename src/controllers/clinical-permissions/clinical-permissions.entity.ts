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
export class ClinicalPermissions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column('jsonb')
    nutricional: Permissions;

    @Column('jsonb')
    vermifugacao: Permissions;

    @Column('jsonb')
    vacinas: Permissions;

    @Column('jsonb')
    procedimentos: Permissions;

    @Column('jsonb')
    ferregeamento: Permissions;

    @Column('jsonb')
    exames: Permissions;

    constructor(
        username: string,
        nutricional: Permissions,
        vermifugacao: Permissions,
        vacinas: Permissions,
        procedimentos: Permissions,
        ferregeamento: Permissions,
        exames: Permissions,
    ) {
        this.id = uuidv4();
        this.username = username;
        this.nutricional = nutricional;
        this.vermifugacao = vermifugacao;
        this.vacinas = vacinas;
        this.procedimentos = procedimentos;
        this.ferregeamento = ferregeamento;
        this.exames = exames;
    }
}
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
export class SportPermissions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column('jsonb')
    evento: Permissions;

    @Column('jsonb')
    competicoes: Permissions;

    @Column('jsonb')
    animal: Permissions;

    constructor(
        username: string,
        evento: Permissions,
        competicoes: Permissions,
        animal: Permissions,
    ) {
        this.id = uuidv4();
        this.username = username;
        this.evento = evento;
        this.competicoes = competicoes;
        this.animal = animal;
    }
}
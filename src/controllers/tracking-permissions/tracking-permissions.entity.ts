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
export class TrackingPermissions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column('jsonb')
    marcacoes: Permissions;

    @Column('jsonb')
    medidas: Permissions;

    constructor(
        username: string,
        marcacoes: Permissions,
        medidas: Permissions,
    ) {
        this.id = uuidv4();
        this.username = username;
        this.marcacoes = marcacoes;
        this.medidas = medidas;
    }
}
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
export class FinancialPermissions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column('jsonb')
    caixa: Permissions;

    @Column('jsonb')
    graficos: Permissions;

    constructor(
        username: string,
        caixa: Permissions,
        graficos: Permissions
    ) {
        this.id = uuidv4();
        this.username = username;
        this.caixa = caixa;
        this.graficos = graficos;
    }
}
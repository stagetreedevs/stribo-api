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
export class ReproductivePermissions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column('jsonb')
    genealogia: Permissions;

    @Column('jsonb')
    inseminação: Permissions;

    @Column('jsonb')
    prenhes: Permissions;

    constructor(
        username: string,
        genealogia: Permissions,
        inseminação: Permissions,
        prenhes: Permissions
    ) {
        this.id = uuidv4();
        this.username = username;
        this.genealogia = genealogia;
        this.inseminação = inseminação;
        this.prenhes = prenhes;
    }
}
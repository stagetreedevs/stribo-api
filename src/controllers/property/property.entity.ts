/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Property {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: "" })
    code: string;

    @Column()
    owner: string;

    @Column('jsonb', { default: [] })
    admins: string[] = [];

    constructor(
        name: string,
        code: string,
        owner: string,
        admins: string[] = [],
    ) {
        this.id = uuidv4();
        this.name = name;
        this.code = code;
        this.owner = owner;
        this.admins = admins;
    }
}

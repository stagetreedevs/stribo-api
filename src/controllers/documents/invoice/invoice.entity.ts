/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    invoice_number: string;

    @Column()
    property: string;

    @Column()
    provider: string;

    @Column()
    CPF: string;

    @Column()
    address: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column('decimal', { precision: 10, scale: 2 })
    value: number;

    @Column()
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    date: Date;

    constructor(
        property: string,
        provider: string,
        CPF: string,
        address: string,
        email: string,
        phone: string,
        value: number,
        description: string,
        date: Date
    ) {
        this.invoice_number = uuidv4();
        this.property = property;
        this.provider = provider;
        this.CPF = CPF;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.value = value;
        this.description = description;
        this.date = date;
    }
}
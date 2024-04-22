/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Receipt {
    @PrimaryGeneratedColumn('uuid')
    receipt_number: string;

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

    @Column({ type: 'timestamp', nullable: false })
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
        this.receipt_number = uuidv4();
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
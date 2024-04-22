/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
interface Installment {
    parcel: number,
    value: number,
    due_date: Date
};
@Entity()
export class BankSlip {
    @PrimaryGeneratedColumn('uuid')
    ticket_number: string;

    @Column()
    property: string;

    @Column()
    provider: string;

    @Column('decimal', { precision: 10, scale: 2 })
    value: number;

    @Column()
    payment: boolean;

    @Column('jsonb', { nullable: true })
    installments: Installment[] | null;

    @Column()
    status: string;

    @Column()
    CPF: string;

    @Column()
    address: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    date: Date;

    constructor(
        property: string,
        provider: string,
        value: number,
        payment: boolean,
        installments: Installment[] | null,
        status: string,
        CPF: string,
        address: string,
        email: string,
        phone: string,
        date: Date
    ) {
        this.ticket_number = uuidv4();
        this.property = property;
        this.CPF = CPF;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.provider = provider;
        this.value = value;
        this.payment = payment;
        this.installments = installments;
        this.status = status;
        this.date = date;
    }
}
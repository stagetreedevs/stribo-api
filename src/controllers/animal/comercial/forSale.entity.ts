/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
interface Installment {
    parcel: number,
    value: number,
    due_date: Date
};
@Entity()
export class ForSale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    animal_id: string;

    @Column()
    animal_name: string;

    @Column()
    animal_photo: string;

    @Column()
    animal_register: string;

    @Column()
    property: string;

    @Column('decimal', { precision: 10, scale: 2 })
    value: number;

    @Column()
    payment: boolean;

    @Column('jsonb', { nullable: true })
    installments: Installment[] | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    date: Date;

    constructor(
        animal_id: string,
        animal_name: string,
        animal_photo: string,
        animal_register: string,
        property: string,
        value: number,
        payment: boolean,
        installments: Installment[] | null,
        date: Date
    ) {
        this.id = uuidv4();
        this.animal_id = animal_id;
        this.animal_name = animal_name;
        this.animal_photo = animal_photo;
        this.animal_register = animal_register;
        this.property = property;
        this.value = value;
        this.payment = payment;
        this.installments = installments;
        this.date = date;
    }
}

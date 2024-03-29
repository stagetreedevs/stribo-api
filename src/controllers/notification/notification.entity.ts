/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user: string;

    @Column()
    title: string;

    @Column()
    message: string;

    @Column()
    hour: string;

    @Column({ default: false })
    read: boolean;

    @Column({ default: '' })
    animal: string;

    @Column({ default: '' })
    operator: string;

    @Column({ default: '' })
    category: string;

    @Column({ default: '' })
    subCategory: string;

    @Column({ type: 'date', default: () => 'now()' })
    date: Date;

    constructor(
        user: string,
        title: string,
        message: string,
        hour: string,
        read: boolean,
        animal: string,
        operator: string,
        category: string,
        subCategory: string,
        date: Date
    ) {
        this.id = uuidv4();
        this.user = user;
        this.title = title;
        this.message = message;
        this.hour = hour;
        this.read = read;
        this.animal = animal;
        this.operator = operator;
        this.category = category;
        this.subCategory = subCategory;
        this.date = date;
    }
}

/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class AnimalDocument {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    animal: string;

    @Column()
    property: string;

    @Column()
    url: string;

    @Column()
    filename: string;

    @Column()
    size: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    date: Date;

    constructor(
        animal: string,
        property: string,
        url: string,
        filename: string,
        size: string,
        date: Date
    ) {
        this.id = uuidv4();
        this.animal = animal;
        this.property = property;
        this.url = url;
        this.filename = filename;
        this.size = size;
        this.date = date;
    }
}

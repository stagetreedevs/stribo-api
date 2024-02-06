/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Biometry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    animal_id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    date: Date;

    @Column({ default: 0, type: 'numeric' })
    weight: number;

    @Column({ default: 0, type: 'numeric' })
    height: number;

    constructor(
        animal_id: string,
        date: Date,
        weight: number,
        height: number,
    ) {
        this.id = uuidv4();
        this.animal_id = animal_id;
        this.date = date;
        this.weight = weight;
        this.height = height;
    }
}

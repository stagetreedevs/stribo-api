/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Death {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    animal_id: string;

    @Column({ type: 'date' })
    dateDeath: Date;

    @Column()
    reason: string;

    constructor(
        animal_id: string,
        dateDeath: Date,
        reason: string
    ) {
        this.id = uuidv4();
        this.animal_id = animal_id;
        this.dateDeath = dateDeath;
        this.reason = reason;
    }
}

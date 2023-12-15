/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Animal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    owner: string;

    @Column()
    name: string;

    @Column()
    race: string;

    @Column()
    coat: string;

    @Column()
    registerNumber: string;

    @Column({ default: '', nullable: true })
    property: string;

    @Column()
    sex: string;

    @Column({ default: null })
    photo: string;

    @Column({ default: '', nullable: true })
    occupation: string;

    @Column({ nullable: true })
    castrated: boolean;

    @Column({ default: '', nullable: true })
    sale: string;

    @Column({ default: null })
    value: string;

    @Column({ type: 'date', default: () => 'now()' })
    registerDate: Date;

    @Column({ type: 'date', nullable: true, default: null })
    birthDate: Date;

    @Column({ type: 'date', nullable: true, default: null })
    castrationDate: Date;

    @Column({ default: '', nullable: true })
    father: string;

    @Column({ default: '', nullable: true })
    mother: string;

    constructor(
        owner: string,
        name: string,
        race: string,
        coat: string,
        registerNumber: string,
        property: string,
        sex: string,
        photo: string,
        occupation: string,
        castrated: boolean,
        sale: string,
        value: string,
        registerDate: Date,
        birthDate: Date,
        castrationDate: Date,
        father: string,
        mother: string,
    ) {
        this.id = uuidv4();
        this.owner = owner;
        this.name = name;
        this.race = race;
        this.coat = coat;
        this.registerNumber = registerNumber;
        this.property = property;
        this.sex = sex;
        this.photo = photo;
        this.occupation = occupation;
        this.castrated = castrated;
        this.sale = sale;
        this.value = value;
        this.registerDate = registerDate;
        this.birthDate = birthDate;
        this.castrationDate = castrationDate;
        this.father = father;
        this.mother = mother;
    }
}

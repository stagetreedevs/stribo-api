/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  AfterLoad,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MovementsEntity } from '../properties/entity/movements.entity';
import { Breed } from './breed.entity';
import { Coat } from './coat.entity';

@Entity()
export class Animal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @Column({ default: '', nullable: true })
  owner_name: string;

  @Column()
  name: string;

  @ManyToOne(() => Breed, { nullable: true, eager: true })
  @JoinColumn({ name: 'breed_id' })
  breed: Breed | null;

  @Column({ nullable: true })
  breed_id: string | null;

  @ManyToOne(() => Coat, { nullable: true, eager: true })
  @JoinColumn({ name: 'coat_id' })
  coat: Coat | null;

  @Column({ nullable: true })
  coat_id: string | null;

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

  @Column({ default: true })
  alive: boolean;

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
  father_id: string;

  @Column({ default: '', nullable: true })
  mother: string;

  @Column({ default: '', nullable: true })
  mother_id: string;

  @OneToMany(() => MovementsEntity, (movement) => movement.animal, {
    onDelete: 'CASCADE',
  })
  movements: MovementsEntity[];

  race?: string;
  coat_old?: string;

  constructor(
    owner: string,
    owner_name: string,
    name: string,
    breed: Breed | null,
    coat: Coat | null,
    registerNumber: string,
    property: string,
    sex: string,
    photo: string,
    occupation: string,
    castrated: boolean,
    alive: boolean,
    sale: string,
    value: string,
    registerDate: Date,
    birthDate: Date,
    castrationDate: Date,
    father: string,
    father_id: string,
    mother: string,
    mother_id: string,
  ) {
    this.id = uuidv4();
    this.owner = owner;
    this.owner_name = owner_name;
    this.name = name;
    this.breed = breed;
    this.coat = coat;
    this.registerNumber = registerNumber;
    this.property = property;
    this.sex = sex;
    this.photo = photo;
    this.occupation = occupation;
    this.castrated = castrated;
    this.alive = alive;
    this.sale = sale;
    this.value = value;
    this.registerDate = registerDate;
    this.birthDate = birthDate;
    this.castrationDate = castrationDate;
    this.father = father;
    this.father_id = father_id;
    this.mother = mother;
    this.mother_id = mother_id;

    if (breed) {
      this.breed_id = breed.id;
      this.race = breed.name;
    }
    if (coat) {
      this.coat_id = coat.id;
      this.coat_old = coat.name;
    }
  }

  @AfterLoad()
  loadCompatibilityFields() {
    if (this.breed) {
      this.race = this.breed.name;
    }
    if (this.coat) {
      this.coat_old = this.coat.name;
    }
  }

  get raceName(): string {
    return this.breed?.name || '';
  }

  get coatName(): string {
    return this.coat?.name || '';
  }
}

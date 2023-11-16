/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: null })
  picture: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ default: null })
  profile: string;

  @Column({ default: null })
  cpf: string;

  @Column({ default: null })
  phone: string;

  @Column()
  email: string;

  @Column({ default: null })
  password: string;

  constructor(
    picture: string,
    first_name: string,
    last_name: string,
    profile: string,
    cpf: string,
    phone: string,
    email: string,
    password: string
  ) {
    this.id = uuidv4();
    this.picture = picture;
    this.first_name = first_name;
    this.last_name = last_name;
    this.profile = profile;
    this.cpf = cpf;
    this.phone = phone;
    this.email = email;
    this.password = password;
  }
}

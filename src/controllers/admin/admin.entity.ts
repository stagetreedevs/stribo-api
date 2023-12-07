/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: null })
  cpf: string;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  role: string;

  @Column({ default: null })
  status: string;

  @Column({ default: null })
  photo: string;

  constructor(
    name: string,
    username: string,
    password: string,
    cpf: string,
    phone: string,
    role: string,
    status: string,
    photo: string
  ) {
    this.id = uuidv4();
    this.name = name;
    this.username = username;
    this.password = password;
    this.cpf = cpf;
    this.phone = phone;
    this.role = role;
    this.status = status;
    this.photo = photo;
  }
}

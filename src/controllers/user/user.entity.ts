/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  type: string;

  @Column()
  cpf: string;

  @Column()
  phone: string;

  @Column({ default: null })
  photo: string;

  @Column({ default: false })
  recieve_notifications: boolean;

  @Column({ default: null })
  token: string;

  @Column({ default: true })
  first_login: boolean;

  @Column({ default: true })
  active: boolean;

  constructor(
    name: string,
    last_name: string,
    username: string,
    password: string,
    type: string,
    cpf: string,
    phone: string,
    photo: string,
    recieve_notifications: boolean,
    token: string,
    first_login: boolean,
  ) {
    this.id = uuidv4();
    this.name = name;
    this.last_name = last_name;
    this.username = username;
    this.password = password;
    this.type = type || 'user';
    this.cpf = cpf;
    this.phone = phone;
    this.photo = photo;
    this.recieve_notifications = recieve_notifications;
    this.token = token;
    this.first_login = first_login;
    this.active = true;
  }
}

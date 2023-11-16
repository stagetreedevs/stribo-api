/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async create(user: User): Promise<User> {
    const verifyUser = await this.findEmail(user.email);

    if (verifyUser) {
      throw new HttpException('Usuario ja cadastrado', HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const verifyUser = await this.userRepository.findOne({
      where: {
        id: id,
      }
    });

    if (!verifyUser) {
      throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
    }

    return verifyUser;
  }

  async findEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email,
      }
    });
  }

  async update(id: string, user: User): Promise<User> {
    const verifyUser = await this.findOne(id);

    if (!verifyUser) {
      throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async updatePassword(id: string, newPassword: string): Promise<User> {
    const verifyUser = await this.findOne(id);

    if (!verifyUser) {
      throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ password: newPassword })
      .where("id = :id", { id })
      .execute();

    return this.findOne(id);
  }


  async remove(id: string): Promise<void> {
    const verifyUser = await this.findOne(id);

    if (!verifyUser) {
      throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.delete(id);
  }

}

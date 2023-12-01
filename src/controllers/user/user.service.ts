/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { S3Service } from '../s3/s3.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service
  ) { }

  async create(user: User, photo: Express.Multer.File): Promise<User> {
    const verifyUser = await this.findEmail(user.username);

    if (verifyUser) {
      throw new HttpException('Usuario ja cadastrado', HttpStatus.BAD_REQUEST);
    }

    let imageUrl: string | null = null;

    if (!!photo) {
      const url = await this.s3Service.upload(photo, 'usuarios');
      imageUrl = url;
    }

    user.photo = imageUrl;

    return await this.userRepository.save(user);
  }

  async createByEmail(user: User): Promise<User> {
    const verifyUser = await this.findEmail(user.username);

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
        username: email,
      }
    });
  }

  async update(id: string, user: any, photo: Express.Multer.File): Promise<User> {
    const verifyUser = await this.findOne(id);

    if (!verifyUser) {
      throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
    }

    let imageUrl: string | null = verifyUser.photo;

    if (!!photo) {
      const url = await this.s3Service.upload(photo, 'usuarios');
      imageUrl = url;

      if (verifyUser.photo) {
        await this.s3Service.deleteFileS3(verifyUser.photo);
      }
    }

    // Atualiza os campos do usuário apenas se eles não forem nulos
    verifyUser.photo = imageUrl;
    verifyUser.name = user.name || verifyUser.name;
    verifyUser.last_name = user.last_name || verifyUser.last_name;
    verifyUser.type = user.type || verifyUser.type;
    verifyUser.cpf = user.cpf || verifyUser.cpf;
    verifyUser.phone = user.phone || verifyUser.phone;

    await this.userRepository.update(id, verifyUser);
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

    await this.s3Service.deleteFileS3(verifyUser.photo);

    if (!verifyUser) {
      throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.delete(id);
  }

}

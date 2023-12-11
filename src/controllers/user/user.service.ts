/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { S3Service } from '../s3/s3.service';
import { MailerService } from '@nestjs-modules/mailer';
import { AdminService } from '../admin/admin.service';
import { UserGoogleDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AdminService)) private readonly adminService: AdminService,
    private readonly s3Service: S3Service,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService
  ) { }

  async authDatabase(body: UserGoogleDto) {
    //Verifica se esse cara já é um admin
    const verifyAdm = await this.adminService.findEmail(body.email)
    if (verifyAdm) {
      throw new HttpException('O Usuario é um Administrador', HttpStatus.BAD_REQUEST);
    }

    //Verifica se ele já está cadastrado no sistema
    const user = await this.findEmail(body.email)

    //Se estiver cadastro ele loga
    if (user) {
      // Gera o token de acesso
      const json = {
        accessToken: this.jwtService.sign({
          type: 'user',
          ...user,
        }),
        user: user,
      };
      return json;
    }

    //Caso o contrário é automaticamente adicionado ao sistema com uma senha temporaria
    else {
      const newGoogleUser = new User(
        body.firstName,
        body.lastName,
        body.email,
        this.generateStrongPassword(),
        '',
        '',
        '',
        body.picture,
        false,
        null,
        true,
      );
      // Cria o usuário
      const created = await this.userRepository.save(newGoogleUser);
      //Manda um email com sua nova senha
      const titleContent = `Sua Senha Temporária Stribo`;
      const htmlContent = `
                  <p>Utilize a senha abaixo para acessar o sistema:</p><br>
                  <b>${created.password}</b>
                  <p>Por favor, faça login imediatamente usando essas credenciais. Recomendamos que você altere sua senha assim que possível por razões de segurança.</p>
                  <p>Se precisar de assistência adicional ou tiver alguma dúvida, não hesite em nos contatar respondendo a este e-mail.</p><br>
                  <p>Atenciosamente</p>
                  <p>Equipe Stribo</p>`;
      await this.mailService.sendMail({
        to: created.username,
        from: 'apistagetree@gmail.com',
        subject: titleContent,
        html: htmlContent
      });

      // Gera o token de acesso
      const json = {
        accessToken: this.jwtService.sign({
          type: 'user',
          ...created,
        }),
        user: created,
      };

      return json;
    }
  }

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

  async findEmail(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  generateStrongPassword(): string {
    const length = 8;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }

  async passwordRecover(email: string): Promise<User> {
    // const user = await this.findOne(id);
    const user = await this.findEmail(email);

    if (user) {
      const newPass = this.generateStrongPassword();
      await this.updatePassword(user.id, newPass);

      //Manda um email com sua nova senha
      const titleContent = `Redefinição de Senha Stribo`;
      const htmlContent = `
                    <p>Sua senha foi redefinida com sucesso:</p><br>
                    <b>${newPass}</b><br>
                    <p>Caso você tenha realizado essa redefinição, ignore esta mensagem. Caso contrário, recomendamos que você altere sua senha imediatamente para garantir a segurança da sua conta.</p>
                    <p>Se precisar de assistência adicional ou tiver alguma dúvida, não hesite em nos contatar respondendo a este e-mail.</p><br>
                    <p>Atenciosamente</p>
                    <p>Equipe Stribo</p>`;
      await this.mailService.sendMail({
        to: user.username,
        from: 'apistagetree@gmail.com',
        subject: titleContent,
        html: htmlContent
      });

      return await this.findOne(user.id);

    }
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

  async fistLogin(id: string, newPassword: string, newName: string): Promise<User> {
    const verifyUser = await this.findOne(id);

    if (!verifyUser) {
      throw new HttpException('Usuario nao encontrado', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ first_login: false, password: newPassword, name: newName })
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

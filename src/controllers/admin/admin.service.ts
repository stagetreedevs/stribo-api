/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { S3Service } from '../s3/s3.service';
import { PropertyService } from '../property/property.service';
import { AdminDto } from './admin.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin) private readonly adminRepos: Repository<Admin>,
        @Inject(forwardRef(() => PropertyService)) private readonly propertyService: PropertyService,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly s3Service: S3Service,
        private readonly mailService: MailerService
    ) { }

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

    async create(body: AdminDto, property: string): Promise<Admin> {
        //Verifica se a propriedade passada é válida
        const propriedade = await this.propertyService.findOne(property);
        if (!propriedade) {
            throw new HttpException('Propriedade nao encontrada', HttpStatus.BAD_REQUEST);
        }

        //Verifica se o cara é um usuário
        const isUser = await this.userService.findEmail(body.username);
        if (isUser) {
            throw new HttpException('Ele já é um usuário não admin!', HttpStatus.BAD_REQUEST);
        }

        //Verifica se o usuário já existe
        const verifyAdm: any = await this.findEmail(body.username);
        if (verifyAdm) {
            //Caso exista o admin é adicionado na propriedade passada
            await this.propertyService.addAdmins(property, verifyAdm.id);
            return verifyAdm;
        }
        //Se o admin não existe cria ele
        const newAdmin = new Admin(
            '',
            body.username,
            this.generateStrongPassword(),
            body.cpf,
            body.phone,
            body.role,
            'Pendente',
            null,
            true
        );

        const created = await this.adminRepos.save(newAdmin);
        await this.propertyService.addAdmins(property, created.id);

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

        return created;

    }

    async passwordRecover(id: string): Promise<Admin> {
        const admin = await this.findOne(id);

        if (admin) {
            const newPass = this.generateStrongPassword();
            await this.updatePassword(id, newPass);

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
                to: admin.username,
                from: 'apistagetree@gmail.com',
                subject: titleContent,
                html: htmlContent
            });

            return await this.findOne(id);

        }
    }

    async findAll(): Promise<Admin[]> {
        return this.adminRepos.find();
    }

    async findOne(id: string): Promise<Admin> {
        const verify = await this.adminRepos.findOne({ where: { id } });
        if (!verify) {
            throw new HttpException('Administrador não encontrado', HttpStatus.BAD_REQUEST);
        }
        return verify;
    }

    async findEmail(email: string): Promise<Admin> {
        return this.adminRepos.findOne({
            where: {
                username: email,
            }
        });
    }

    async update(id: string, admin: any, photo: Express.Multer.File): Promise<Admin> {
        const verify = await this.findOne(id);

        let imageUrl: string | null = verify.photo;

        if (!!photo) {
            const url = await this.s3Service.upload(photo, 'admin');
            imageUrl = url;

            if (verify.photo) {
                await this.s3Service.deleteFileS3(verify.photo);
            }
        }

        // Atualiza os campos do usuário apenas se eles não forem nulos
        verify.photo = imageUrl;
        verify.name = admin.name || verify.name;
        verify.username = admin.username || verify.username;
        verify.cpf = admin.cpf || verify.cpf;
        verify.phone = admin.phone || verify.phone;
        verify.role = admin.role || verify.role;

        await this.adminRepos.update(id, verify);
        return this.findOne(id);
    }

    async firstLogin(id: string, newPassword: string, newName: string): Promise<Admin> {
        // Verifica se o administrador existe
        await this.findOne(id);

        await this.adminRepos
            .createQueryBuilder()
            .update(Admin)
            .set({ first_login: false, status: () => "'Ativo'", password: newPassword, name: newName })
            .where("id = :id", { id })
            .execute();

        return this.findOne(id);
    }

    async updatePassword(id: string, newPassword: string): Promise<Admin> {
        await this.findOne(id);

        await this.adminRepos
            .createQueryBuilder()
            .update(Admin)
            .set({ password: newPassword })
            .where("id = :id", { id })
            .execute();

        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const verify = await this.findOne(id);

        // Remove a imagem da AWS
        if (verify.photo) {
            await this.s3Service.deleteFileS3(verify.photo);
        }

        // Busca as propriedades associadas ao administrador
        const associatedProperties = await this.propertyService.findByAdmin(id);

        // Remove o administrador de todas as propriedades associadas
        await Promise.all(
            associatedProperties.map(async property => {
                await this.propertyService.removeAdmin(property.id, id);
            })
        );

        // Remove o administrador do banco de dados
        await this.adminRepos.delete(id);
    }


}
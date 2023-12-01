/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/controllers/user/user.service';
import { User } from 'src/controllers/user/user.entity';
@Injectable()
export class GoogleService {
    constructor(private readonly userService: UserService) { }

    async googleLogin(req) {
        if (!req.user) {
            return 'Usuario Google nao encontrado!';
        }

        let user;

        const existingUser = await this.userService.findEmail(req.user.email);

        if (existingUser) {
            user = existingUser;
        } else {
            const googleInfo = req.user;
            if (googleInfo) {
                const newUser = new User(
                    googleInfo.firstName,
                    googleInfo.lastName,
                    googleInfo.email,
                    '',
                    '',
                    '',
                    '',
                    googleInfo.picture,
                    false,
                    '',
                    false
                );
                user = await this.userService.createByEmail(newUser);
            }
        }

        return { user };
    }


}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { GoogleService } from './google.service';
import { UserModule } from 'src/controllers/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [],
    providers: [GoogleStrategy, GoogleService],
    exports: [GoogleService]

})
export class GoogleModule { }

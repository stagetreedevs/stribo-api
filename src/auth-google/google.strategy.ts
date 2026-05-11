/* eslint-disable prettier/prettier */
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        const clientID = process.env.GOOGLE_CLIENT_ID || 'missing-google-client-id';
        const clientSecret = process.env.GOOGLE_SECRET || 'missing-google-secret';
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_SECRET) {
            new Logger('GoogleStrategy').warn(
                'GOOGLE_CLIENT_ID/GOOGLE_SECRET não configurados — login Google ficará indisponível.',
            );
        }
        super({
            clientID,
            clientSecret,
            callbackURL: 'http://localhost:3000/auth/google/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        console.log(profile);
        const { name, emails, photos } = profile
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, user);
    }
}
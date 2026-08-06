import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AsaasService } from './asaas.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => {
        let accessToken = (process.env.PAYMENT_ACCESS_TOKEN || '').trim();
        if (
          (accessToken.startsWith("'") && accessToken.endsWith("'")) ||
          (accessToken.startsWith('"') && accessToken.endsWith('"'))
        ) {
          accessToken = accessToken.slice(1, -1).trim();
        }
        if (accessToken.startsWith('$$')) {
          accessToken = accessToken.slice(1);
        }
        if (
          !accessToken.startsWith('$') &&
          /^aact_(hmlg|prod|ysnd)_/.test(accessToken)
        ) {
          accessToken = `$${accessToken}`;
        }

        let baseURL = (process.env.PAYMENT_API || '').trim().replace(/\/$/, '');
        if (baseURL.includes('sandbox.asaas.com') && !baseURL.endsWith('/v3')) {
          baseURL = 'https://api-sandbox.asaas.com/v3';
        }
        if (
          baseURL === 'https://api.asaas.com' ||
          baseURL === 'http://api.asaas.com'
        ) {
          baseURL = 'https://api.asaas.com/v3';
        }

        return {
          baseURL,
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'stribo-api/1.0 (NestJS)',
            access_token: accessToken,
          },
        };
      },
    }),
  ],
  providers: [AsaasService],
  exports: [AsaasService],
})
export class AsaasModule {}

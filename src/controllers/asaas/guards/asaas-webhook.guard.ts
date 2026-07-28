import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AsaasWebhookGuard implements CanActivate {
  private readonly logger = new Logger(AsaasWebhookGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const expectedToken = (process.env.ASAAS_WEBHOOK_TOKEN || '').trim();
    const receivedToken = String(
      request.headers['asaas-access-token'] || '',
    ).trim();

    if (!expectedToken) {
      this.logger.error(
        'ASAAS_WEBHOOK_TOKEN não configurado no .env. Webhook recusado.',
      );
      throw new UnauthorizedException(
        'Webhook Asaas não configurado no servidor',
      );
    }

    if (!receivedToken || receivedToken !== expectedToken) {
      this.logger.warn(
        'Webhook Asaas rejeitado: asaas-access-token inválido ou ausente',
      );
      throw new UnauthorizedException(
        'Token de autenticação do webhook inválido',
      );
    }

    return true;
  }
}

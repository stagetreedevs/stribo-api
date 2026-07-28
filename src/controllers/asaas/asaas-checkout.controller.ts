import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AsaasCheckoutService } from './asaas-checkout.service';
import { AsaasWebhookGuard } from './guards/asaas-webhook.guard';
import { AsaasWebhookPayload } from './interfaces/checkout.interfaces';
import {
  CreateCheckoutDto,
  PayWithCreditCardDto,
} from 'src/services/asaas/dto/payments.dto';
import { SyncCustomerDto } from 'src/services/asaas/dto/customers.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('ASAAS - CHECKOUT')
@ApiBearerAuth()
@Controller('asaas')
export class AsaasCheckoutController {
  constructor(private readonly checkoutService: AsaasCheckoutService) { }

  @Get('integration/verify')
  @ApiOperation({
    summary: 'Verificar integração com o Asaas (público)',
    description:
      'Não requer JWT. Testa PAYMENT_API e PAYMENT_ACCESS_TOKEN do servidor contra a API do Asaas.',
  })
  async verifyIntegration() {
    return this.checkoutService.verifyIntegration();
  }

  @Get('webhook/verify')
  @ApiOperation({
    summary: 'Verificar configuração do webhook Asaas',
    description:
      'Público. Informa se ASAAS_WEBHOOK_TOKEN está configurado. Envie o header asaas-access-token para validar o token.',
  })
  async verifyWebhookConfig(@Req() req: any) {
    const token = req.headers['asaas-access-token'];
    return this.checkoutService.verifyWebhookConfig(token);
  }

  @UseGuards(AsaasWebhookGuard)
  @Post('webhook/verify')
  @ApiOperation({
    summary: 'Testar autenticação do webhook Asaas',
    description:
      'Exige header asaas-access-token igual ao ASAAS_WEBHOOK_TOKEN. Retorna 200 se a conexão/token estiver correto.',
  })
  async verifyWebhookAuth() {
    return {
      success: true,
      authenticated: true,
      message:
        'Webhook autenticado com sucesso. Conexão pronta para receber eventos do Asaas.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('customers/sync')
  @ApiOperation({ summary: 'Sincronizar usuário como cliente no Asaas' })
  @ApiBody({ type: SyncCustomerDto, required: false })
  async syncCustomer(@Req() req: any, @Body() body?: SyncCustomerDto) {
    return this.checkoutService.syncCustomer(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  @ApiOperation({
    summary: 'Criar checkout (boleto, PIX ou cartão)',
    description:
      'Cria cobrança no Asaas e retorna dados para checkout personalizado (QR PIX, linha digitável do boleto, etc.)',
  })
  @ApiBody({ type: CreateCheckoutDto })
  async createCheckout(@Req() req: any, @Body() body: CreateCheckoutDto) {
    return this.checkoutService.createCheckout(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkout')
  @ApiOperation({ summary: 'Listar checkouts do usuário' })
  async listCheckouts(@Req() req: any) {
    return this.checkoutService.listCheckouts(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkout/:id')
  @ApiOperation({ summary: 'Obter checkout com dados de pagamento' })
  @ApiQuery({ name: 'installmentNumber', required: false, type: Number })
  async getCheckout(
    @Req() req: any,
    @Param('id') id: string,
    @Query('installmentNumber') installmentNumber?: number,
  ) {
    const installment = installmentNumber
      ? Number(installmentNumber)
      : undefined;

    return this.checkoutService.getCheckout(id, req.user.id, installment);
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkout/:id/status')
  @ApiOperation({ summary: 'Consultar status do checkout' })
  async getCheckoutStatus(@Req() req: any, @Param('id') id: string) {
    return this.checkoutService.getCheckoutStatus(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkout/:id/billing-info')
  @ApiOperation({
    summary: 'Atualizar dados de pagamento (PIX, boleto)',
    description:
      'Útil para renovar QR Code PIX ou obter linha digitável do boleto',
  })
  async refreshBillingInfo(@Req() req: any, @Param('id') id: string) {
    return this.checkoutService.refreshBillingInfo(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout/:id/credit-card')
  @ApiOperation({
    summary: 'Pagar checkout existente com cartão de crédito',
    description:
      'Use quando o checkout foi criado como BOLETO ou PIX e o cliente escolhe pagar com cartão depois',
  })
  @ApiBody({ type: PayWithCreditCardDto })
  async payWithCreditCard(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: PayWithCreditCardDto,
  ) {
    const remoteIp =
      req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip;

    return this.checkoutService.payWithCreditCard(
      id,
      req.user.id,
      body,
      String(remoteIp).split(',')[0].trim(),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('checkout/:id')
  @ApiOperation({ summary: 'Cancelar checkout' })
  async cancelCheckout(@Req() req: any, @Param('id') id: string) {
    await this.checkoutService.cancelCheckout(id, req.user.id);
    return { cancelled: true };
  }

  @UseGuards(AsaasWebhookGuard)
  @Post('webhook')
  @ApiOperation({
    summary: 'Webhook do Asaas (sem autenticação JWT)',
    description:
      'Recebe eventos do Asaas. Autenticação via header asaas-access-token (ASAAS_WEBHOOK_TOKEN).',
  })
  async webhook(@Body() body: AsaasWebhookPayload) {
    await this.checkoutService.handleWebhook(body);
    return { received: true };
  }
}

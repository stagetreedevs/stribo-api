export class AsaasIntegrationStatusDto {
  success: boolean;
  configured: boolean;
  connected: boolean;
  environment?: 'sandbox' | 'production' | 'unknown';
  message: string;
  apiUrl?: string;
  tokenPreview?: string;
  httpStatus?: number;
  asaasErrors?: Array<{ code: string; description: string }>;
  account?: {
    name?: string;
    email?: string;
    cpfCnpj?: string;
  };
  hints?: string[];
}

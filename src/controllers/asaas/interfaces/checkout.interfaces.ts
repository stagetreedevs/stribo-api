import { Payment } from 'src/services/asaas/dto/payments.dto';

export enum CheckoutWebhookEvent {
  PAYMENT_CREATED = 'PAYMENT_CREATED',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_OVERDUE = 'PAYMENT_OVERDUE',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',
  PAYMENT_DELETED = 'PAYMENT_DELETED',
  PAYMENT_UPDATED = 'PAYMENT_UPDATED',
}

export interface AsaasWebhookPayload {
  id: string;
  event: CheckoutWebhookEvent;
  dateCreated: string;
  payment: Payment;
}

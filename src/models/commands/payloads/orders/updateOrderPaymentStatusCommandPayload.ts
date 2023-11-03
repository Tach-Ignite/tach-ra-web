import { IPaymentStatusEnum } from '@/lib/abstractions';

export type UpdateOrderPaymentStatusCommandPayload = {
  orderId: string;
  checkoutSessionId: string;
  paymentStatus: Extract<keyof IPaymentStatusEnum, string>;
  paymentProvider: string;
};

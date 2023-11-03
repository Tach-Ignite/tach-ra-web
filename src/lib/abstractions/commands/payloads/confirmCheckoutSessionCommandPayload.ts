import { IConfirmPaymentIntentRequest } from '../../interfaces/payment/shared';

export type ConfirmCheckoutSessionCommandPayload = {
  confirmPaymentIntentRequest: IConfirmPaymentIntentRequest;
};

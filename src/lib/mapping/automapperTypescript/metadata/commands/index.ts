import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import {
  ConfirmCheckoutSessionCommandPayload,
  CreatePaymentIntentCommandPayload,
  ParseConfirmCheckoutSessionCommandPayload,
  ValidateRecaptchaTokenCommandPayload,
} from '@/lib/abstractions';

export function createLibCommandPayloadMetadata() {
  PojosMetadataMap.create<ConfirmCheckoutSessionCommandPayload>(
    'ConfirmCheckoutSessionCommandPayload',
    {
      confirmPaymentIntentRequest: 'IConfirmPaymentIntentRequest',
    },
  );
  PojosMetadataMap.create<CreatePaymentIntentCommandPayload>(
    'CreatePaymentIntentCommandPayload',
    {
      createPaymentIntentRequest: 'ICreatePaymentIntentRequest',
    },
  );
  PojosMetadataMap.create<ParseConfirmCheckoutSessionCommandPayload>(
    'ParseConfirmCheckoutSessionRequestCommandPayload',
    {
      request: Object,
    },
  );
  PojosMetadataMap.create<ValidateRecaptchaTokenCommandPayload>(
    'ValidateRecaptchaTokenCommandPayload',
    {
      recaptchaToken: String,
    },
  );
}

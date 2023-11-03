import { Module, ModuleClass } from '@/lib/ioc/module';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { FormidableFormParser } from '@/lib/services/server/models';
import {
  PayPalPaymentService,
  PaymentServiceFactory,
  StripePaymentService,
} from '@/lib/services/server/payment';
import { StripeClientFactory } from '@/lib/services/server/payment/stripe/stripeClientFactory';
import { SecretsModule } from '../security/secrets.module';

@Module
export class PaymentServiceModule extends ModuleClass {
  constructor() {
    super({
      imports: [ConfigurationModule, SecretsModule],
      providers: [
        {
          provide: 'formParser',
          useClass: FormidableFormParser,
        },
        {
          provide: 'stripeClientFactory',
          useClass: StripeClientFactory,
        },
        {
          provide: 'stripePaymentService',
          useClass: StripePaymentService,
        },
        {
          provide: 'payPalPaymentService',
          useClass: PayPalPaymentService,
        },
        {
          provide: 'paymentServiceFactory',
          useClass: PaymentServiceFactory,
        },
      ],
    });
  }
}

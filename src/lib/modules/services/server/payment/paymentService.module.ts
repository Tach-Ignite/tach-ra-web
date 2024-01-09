import { Module, ModuleClass } from '@/lib/ioc/module';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { StripeClientFactory } from '@/lib/services/server/payment/stripe/stripeClientFactory';
import { FormidableFormParser } from '@/lib/services/server/models/multipartFormParser/formidableMultipartFormParser';
import { StripePaymentService } from '@/lib/services/server/payment/stripe/stripePaymentService';
import { PayPalPaymentService } from '@/lib/services/server/payment/paypal/payPalPaymentService';
import { PaymentServiceFactory } from '@/lib/services/server/payment/paymentServiceFactory';
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

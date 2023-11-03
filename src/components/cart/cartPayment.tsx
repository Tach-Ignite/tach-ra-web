import { IOptions, IPaymentConfiguration } from '@/lib/abstractions';
import { ModuleResolver } from '@/lib/ioc/';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { StripeCartPayment } from './stripeCartPayment';
import { PayPalCartPayment } from './paypalCartPayment';

const m = new ModuleResolver().resolve(ConfigurationModule);
const paymentConfig = m.resolve<IOptions<IPaymentConfiguration>>(
  'paymentConfigurationOptions',
).value;

export function CartPayment() {
  const { provider } = paymentConfig;

  return (
    <div>
      {provider === 'stripe' && <StripeCartPayment />}
      {provider === 'paypal' && <PayPalCartPayment />}
    </div>
  );
}

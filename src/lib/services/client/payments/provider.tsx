import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { IOptions, IPaymentConfiguration } from '@/lib/abstractions';
import { ModuleResolver } from '@/lib/ioc/';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';

const m = new ModuleResolver().resolve(ConfigurationModule);
const paymentConfig: IPaymentConfiguration = m.resolve<
  IOptions<IPaymentConfiguration>
>('paymentConfigurationOptions').value;

export function PaymentContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: 'capture',
  };

  if (paymentConfig.provider === 'stripe') {
    return children;
  }

  if (paymentConfig.provider === 'paypal') {
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>;
  }

  return <>Payment provider ${paymentConfig.provider} is not supported.</>;
}

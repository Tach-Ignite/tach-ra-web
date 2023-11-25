import { PayPalScriptProvider } from '@paypal/react-paypal-js';
// import { IOptions, IPaymentConfiguration } from '@/lib/abstractions';
// import { ModuleResolver } from '@/lib/ioc/';
// import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import tc from '~/tach.config';

// const m = new ModuleResolver().resolve(ConfigurationModule);
// const paymentConfig2: IPaymentConfiguration = m.resolve<
//   IOptions<IPaymentConfiguration>
// >('paymentConfigurationOptions').value;
const paymentConfig = tc.payment;

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

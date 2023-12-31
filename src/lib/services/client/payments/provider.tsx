import { getTachConfig } from '@/lib/utils/getTachConfig';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export function PaymentContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getTachConfig();

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: 'capture',
  };

  if (config.payment.provider === 'stripe') {
    return children;
  }

  if (config.payment.provider === 'paypal') {
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>;
  }

  return <>Payment provider ${config.payment.provider} is not supported.</>;
}

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'next-themes';
import { makeStore } from '@/rtk';
import { PaymentContextProvider } from '@/lib/services/client';

export type ProviderLayoutProps = {
  session: Session;
  children: React.ReactNode;
};

export function ProviderLayout({ session, children }: ProviderLayoutProps) {
  const store = makeStore();
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <PersistGate loading={null} persistor={persistor}>
          <SessionProvider session={session}>
            <PaymentContextProvider>
              <ReCaptchaProvider
                reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
              >
                {children}
              </ReCaptchaProvider>
            </PaymentContextProvider>
          </SessionProvider>
        </PersistGate>
      </ThemeProvider>
    </Provider>
  );
}

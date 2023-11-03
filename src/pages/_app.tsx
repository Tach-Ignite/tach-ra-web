import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import '@/styles/globals.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { RootLayout } from '@/components';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, session: Session) => ReactNode;
};

type AppPropsWithLayout<T> = AppProps<T> & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout<{ session: Session }>) {
  const getLayout =
    Component.getLayout ||
    ((page, session) => <RootLayout session={session}>{page}</RootLayout>);

  return (
    <div className="font-bodyFont">
      {getLayout(<Component {...pageProps} />, session)}
    </div>
  );
}

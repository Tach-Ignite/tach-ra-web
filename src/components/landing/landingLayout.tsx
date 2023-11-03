import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { makeStore } from '@/rtk';
import { LandingHeader } from './header';
import { LandingFooter } from './footer';

export type LandingLayoutProps = {
  children: React.ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
  const store = makeStore();

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <div className="dark:bg-neutral-800 bg-neutral-100 text-neutral-800 dark:text-white flex flex-col min-h-screen">
          <LandingHeader />
          <div className="flex-grow flex justify-center items-center">
            {children}
          </div>
          <LandingFooter />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

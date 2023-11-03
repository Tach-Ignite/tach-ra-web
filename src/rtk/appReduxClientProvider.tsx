import { Provider } from 'react-redux';
import React from 'react';
import { makeStore } from './store';

export function AppReduxClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={makeStore()}>{children}</Provider>;
}

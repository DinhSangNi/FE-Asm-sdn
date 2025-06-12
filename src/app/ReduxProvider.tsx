'use client';

import { AppStore, makeStore, StoreState } from '@/store/store';
import { ReactNode, useMemo } from 'react';
import { Provider } from 'react-redux';

type Props = {
  children: ReactNode;
  preloadedState: StoreState;
};

export function ReduxProvider({ children, preloadedState }: Props) {
  const store: AppStore = useMemo(() => {
    return makeStore(preloadedState);
  }, [preloadedState]);

  return <Provider store={store}>{children}</Provider>;
}

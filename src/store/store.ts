import { configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './userSlice';
import cartReducer from './cartSlice';

export interface StoreState {
  user: UserState;
}

export const makeStore = (preloadedState: StoreState) =>
  configureStore({
    reducer: {
      user: userReducer,
      cart: cartReducer,
    },
    preloadedState,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  userId: string | null;
  name: string | null;
  email: string | null;
  avartar: string | null;
};

const initialState: UserState = {
  userId: null,
  name: null,
  email: null,
  avartar: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        userId: string;
        name: string;
        email: string;
        avartar: string;
      }>
    ) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avartar = action.payload.avartar;
    },
    logout: (state) => {
      state.userId = null;
      state.name = null;
      state.email = null;
      state.avartar = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

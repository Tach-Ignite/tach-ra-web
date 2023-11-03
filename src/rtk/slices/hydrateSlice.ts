import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const hydrateSlice = createSlice({
  name: 'isHydrate',
  initialState: false,
  reducers: {
    setHydrate: (state, action: PayloadAction<boolean>) => action.payload,
  },
});

export const { reducer: hydrateReducer, actions: hydrateActions } =
  hydrateSlice;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserAddressViewModel } from '@/models';

const userAddressSlice = createSlice({
  name: 'userAddress',
  initialState: {
    userAddress: undefined as UserAddressViewModel | undefined,
  },
  reducers: {
    setUserAddress(
      state,
      action: PayloadAction<UserAddressViewModel | undefined>,
    ) {
      state.userAddress = action.payload;
    },
  },
});

const { actions, reducer } = userAddressSlice;
export const { setUserAddress } = actions;
export { reducer as userAddressReducer };

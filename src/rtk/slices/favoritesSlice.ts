import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ProductViewModel } from '@/models';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    favorites: [] as ProductViewModel[],
  },
  reducers: {
    toggleFavorites(state, action: PayloadAction<ProductViewModel>) {
      const product = state.favorites.find((e) => e._id === action.payload._id);
      if (!product) {
        state.favorites.push(action.payload);
      } else {
        state.favorites = state.favorites.filter(
          (e) => e._id !== action.payload._id,
        );
      }
    },
  },
});

const { actions, reducer } = cartSlice;
export const { toggleFavorites } = actions;
export { reducer as favoritesReducer };

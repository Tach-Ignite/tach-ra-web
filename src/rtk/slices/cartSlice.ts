import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ProductViewModel, CartItemViewModel } from '@/models';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [] as CartItemViewModel[],
  },
  reducers: {
    addToCart(state, action: PayloadAction<ProductViewModel>) {
      const product = state.cartItems.find(
        (e) => e.product._id === action.payload._id,
      );
      if (product) {
        product.quantity++;
      } else {
        state.cartItems.push({ product: action.payload, quantity: 1 });
      }
    },
    increaseQuantity(state, action: PayloadAction<CartItemViewModel>) {
      const product = state.cartItems.find(
        (e) => e.product._id === action.payload.product._id,
      );
      if (product && product.quantity < product.product.quantity) {
        product.quantity++;
      }
    },
    decreaseQuantity(state, action: PayloadAction<CartItemViewModel>) {
      const product = state.cartItems.find(
        (e) => e.product._id === action.payload.product._id,
      );
      if (product) {
        product.quantity--;

        if (product.quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (e) => e.product._id !== action.payload.product._id,
          );
        }
      }
    },
    deleteFromCart(state, action: PayloadAction<ProductViewModel>) {
      const product = state.cartItems.find(
        (e) => e.product._id === action.payload._id,
      );
      if (product) {
        state.cartItems = state.cartItems.filter(
          (e) => e.product._id !== action.payload._id,
        );
      }
    },
    clearCart(state) {
      state.cartItems = [];
    },
  },
});

const { actions, reducer } = cartSlice;
export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  clearCart,
} = actions;
export { reducer as cartReducer };

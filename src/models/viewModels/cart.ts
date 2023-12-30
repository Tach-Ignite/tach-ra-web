import { ProductViewModel } from './product';

export type CartItemViewModel = {
  product: ProductViewModel;
  quantity: number;
};

export type CartViewModel = {
  items: CartItemViewModel[];
};

export type AddItemToCartViewModel = {
  productId: string;
  quantity: number;
};

export type RemoveItemFromCartViewModel = {
  productId: string;
};

export type IncreaseCartItemQuantityViewModel = {
  productId: string;
};

export type DecreaseCartItemQuantityViewModel = {
  productId: string;
};

export type SetCartItemQuantityViewModel = {
  productId: string;
  quantity: number;
};

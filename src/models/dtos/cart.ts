export type CartItemDto = {
  productId: string;
  quantity: number;
};

export type CartDto = {
  items: CartItemDto[];
};

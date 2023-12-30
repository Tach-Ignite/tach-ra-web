import { ICart } from '@/models';

export interface ICartService {
  getCart(userId: string): Promise<ICart>;
  addItemToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart>;
  removeItemFromCart(userId: string, productId: string): Promise<ICart>;
  increaseCartItemQuantity(userId: string, productId: string): Promise<ICart>;
  decreaseCartItemQuantity(userId: string, productId: string): Promise<ICart>;
  setCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart>;
  clearCart(userId: string): Promise<ICart>;
}

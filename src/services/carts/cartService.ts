import { ICartQueryRepository, IProductService } from '@/abstractions';
import {
  ICommandRepository,
  IMapper,
  IProvider,
  IQueryRepository,
} from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { CartDto, ProductDto, UserDto } from '@/models';

import '@/mappingProfiles/services/users/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';
import { ICart, ICartItem } from '@/models/domain/cart';
import { ICartService } from '@/abstractions/services/iCartService';

@Injectable(
  'cartService',
  'cartQueryRepository',
  'userCommandRepository',
  'productService',
  'automapperProvider',
)
export class CartService implements ICartService {
  private _cartQueryRepository: ICartQueryRepository;

  private _userCommandRepository: ICommandRepository<UserDto>;

  private _productService: IProductService;

  private _automapperProvider: IProvider<IMapper>;

  constructor(
    cartQueryRepository: ICartQueryRepository,
    userCommandRepository: ICommandRepository<UserDto>,
    productService: IProductService,
    automapperProvider: IProvider<IMapper>,
  ) {
    this._cartQueryRepository = cartQueryRepository;
    this._userCommandRepository = userCommandRepository;
    this._productService = productService;
    this._automapperProvider = automapperProvider;
  }

  async getCart(userId: string): Promise<ICart> {
    const cartDto = await this._cartQueryRepository.getCart(userId);

    if (!cartDto) {
      throw new ErrorWithStatusCode('User not found.', 404);
    }

    const mapper = await this._automapperProvider.provide();
    const products = await this._productService.getProductsByIds(
      cartDto.items.map((e) => e.productId),
    );

    const cart = mapper.map<CartDto, ICart>(cartDto, 'CartDto', 'ICart', {
      extraArgs: () => ({ products }),
    });

    return cart;
  }

  async addItemToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart> {
    const cartDto = await this._cartQueryRepository.getCart(userId);

    if (!cartDto) {
      throw new ErrorWithStatusCode('User not found.', 404);
    }

    const existingCartItem = cartDto.items.find(
      (e) => e.productId === productId,
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      cartDto.items.push({ productId, quantity });
    }

    await this._userCommandRepository.update(userId, { cart: cartDto });

    return this.getCart(userId);
  }

  async removeItemFromCart(userId: string, productId: string): Promise<ICart> {
    const cartDto = await this._cartQueryRepository.getCart(userId);

    if (!cartDto) {
      throw new ErrorWithStatusCode('User not found.', 404);
    }

    cartDto.items = cartDto.items.filter((e) => e.productId !== productId);

    await this._userCommandRepository.update(userId, { cart: cartDto });

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<ICart> {
    await this._userCommandRepository.update(userId, { cart: { items: [] } });

    return this.getCart(userId);
  }

  async increaseCartItemQuantity(
    userId: string,
    productId: string,
  ): Promise<ICart> {
    const cartDto = await this._cartQueryRepository.getCart(userId);

    if (!cartDto) {
      throw new ErrorWithStatusCode('User not found.', 404);
    }

    const cartItem = cartDto.items.find((e) => e.productId === productId);

    if (cartItem) {
      cartItem.quantity++;
    }

    await this._userCommandRepository.update(userId, { cart: cartDto });

    return this.getCart(userId);
  }

  async decreaseCartItemQuantity(
    userId: string,
    productId: string,
  ): Promise<ICart> {
    const cartDto = await this._cartQueryRepository.getCart(userId);

    if (!cartDto) {
      throw new ErrorWithStatusCode('User not found.', 404);
    }

    const cartItem = cartDto.items.find((e) => e.productId === productId);

    if (cartItem) {
      cartItem.quantity--;

      if (cartItem.quantity <= 0) {
        cartDto.items = cartDto.items.filter((e) => e.productId !== productId);
      }
    }

    await this._userCommandRepository.update(userId, { cart: cartDto });

    return this.getCart(userId);
  }

  async setCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart> {
    const cartDto = await this._cartQueryRepository.getCart(userId);

    if (!cartDto) {
      throw new ErrorWithStatusCode('User not found.', 404);
    }

    const cartItem = cartDto.items.find((e) => e.productId === productId);

    if (cartItem) {
      cartItem.quantity = quantity;

      if (cartItem.quantity <= 0) {
        cartDto.items = cartDto.items.filter((e) => e.productId !== productId);
      }
    }

    await this._userCommandRepository.update(userId, { cart: cartDto });

    return this.getCart(userId);
  }
}

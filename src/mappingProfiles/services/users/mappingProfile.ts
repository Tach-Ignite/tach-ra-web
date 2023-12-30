import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import { UserDto, IUser, IProduct, ProductDto } from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import { ITachMappingProfile } from '@/lib/abstractions';
import '../userAddresses/mappingProfile';
import { ICart, ICartItem } from '@/models/domain/cart';
import { CartDto, CartItemDto } from '@/models/dtos/cart';

@TachMappingProfileClass('services/users/mappingProfile')
export class AddressApiCurrentUserMappingProfile
  implements ITachMappingProfile
{
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<CartItemDto, ICartItem>(
        mapper,
        'CartItemDto',
        'ICartItem',
        forMember(
          (d) => d.product,
          mapWithArguments((s, { products }) =>
            (products as IProduct[]).find((p) => p._id === s.productId),
          ),
        ),
      );
      createMap<CartDto, ICart>(
        mapper,
        'CartDto',
        'ICart',
        forMember(
          (d) => d.items,
          mapWithArguments((s, { products }) =>
            mapper.mapArray<CartItemDto, ICartItem>(
              s.items,
              'CartItemDto',
              'ICartItem',
              { extraArgs: () => ({ products }) },
            ),
          ),
        ),
      );
      createMap<ICartItem, CartItemDto>(
        mapper,
        'ICartItem',
        'CartItemDto',
        forMember(
          (d) => d.productId,
          mapFrom((s) => s.product._id),
        ),
      );
      createMap<ICart, CartDto>(
        mapper,
        'ICart',
        'CartDto',
        forMember(
          (d) => d.items,
          mapFrom((s) =>
            mapper.mapArray<ICartItem, CartItemDto>(
              s.items,
              'ICartItem',
              'CartItemDto',
            ),
          ),
        ),
      );
      createMap<IUser, UserDto>(
        mapper,
        'IUser',
        'UserDto',
        forMemberId,
        forMember(
          (d) => d.password,
          mapWithArguments((s, { password }) => password),
        ),
        forMember(
          (d) => d.roles,
          mapFrom((s) => []),
        ),
        forMember(
          (d) => d.addresses,
          mapFrom((s) => []),
        ),
      );
      createMap<UserDto, IUser>(
        mapper,
        'UserDto',
        'IUser',
        forMemberId,
        forMember(
          (d) => d.addresses,
          mapWithArguments((s, { userAddresses }) => userAddresses),
        ),
        forMember(
          (d) => d.cart,
          mapWithArguments((s, { products }) =>
            mapper.map<CartDto, ICart>(s.cart, 'CartDto', 'ICart', {
              extraArgs: () => ({ products }),
            }),
          ),
        ),
      );
    };
  }
}

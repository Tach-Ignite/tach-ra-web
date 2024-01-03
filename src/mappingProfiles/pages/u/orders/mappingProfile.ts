import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@jersmart/automapper-core';

import {
  IAddress,
  ILineItem,
  IPriceData,
  IProductData,
  ITachMappingProfile,
} from '@/lib/abstractions';

import {
  AddressViewModel,
  CartItemViewModel,
  CartViewModel,
  ICart,
  ICartItem,
  IOrder,
  IUser,
  IUserAddress,
  LineItemViewModel,
  OrderViewModel,
  PriceDataViewModel,
  ProductDataViewModel,
  UserAddressViewModel,
  UserViewModel,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';

@TachMappingProfileClass('pages/u/orders/mappingProfile')
export class UserOrdersMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<ICartItem, CartItemViewModel>(
        mapper,
        'ICartItem',
        'CartItemViewModel',
      );
      createMap<ICart, CartViewModel>(mapper, 'ICart', 'CartViewModel');
      createMap<IAddress, AddressViewModel>(
        mapper,
        'IAddress',
        'AddressViewModel',
        forMemberId,
      );
      createMap<IUserAddress, UserAddressViewModel>(
        mapper,
        'IUserAddress',
        'UserAddressViewModel',
        forMemberId,
      );
      createMap<IUser, UserViewModel>(
        mapper,
        'IUser',
        'UserViewModel',
        forMemberId,
      );
      createMap<IProductData, ProductDataViewModel>(
        mapper,
        'IProductData',
        'ProductDataViewModel',
      );
      createMap<IPriceData, PriceDataViewModel>(
        mapper,
        'IPriceData',
        'PriceDataViewModel',
      );
      createMap<ILineItem, LineItemViewModel>(
        mapper,
        'ILineItem',
        'LineItemViewModel',
      );
      createMap<IOrder, OrderViewModel>(
        mapper,
        'IOrder',
        'OrderViewModel',
        forMemberId,
        forMember(
          (d) => d.userAddress,
          mapFrom((s) =>
            mapper.map<IUserAddress, UserAddressViewModel>(
              s.userAddress,
              'IUserAddress',
              'UserAddressViewModel',
            ),
          ),
        ),
      );
    };
  }
}

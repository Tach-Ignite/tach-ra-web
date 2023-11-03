import {
  MappingProfile,
  Mapper,
  createMap,
  forMember,
  mapWithArguments,
  mapFrom,
} from '@jersmart/automapper-core';
import { ITachMappingProfile } from '@/lib/abstractions';
import {
  IOrder,
  IUserAddress,
  OrderDto,
  UserAddressDto,
  UserDto,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import '../userAddresses/mappingProfile';

@TachMappingProfileClass('services/orders/mappingProfile')
export class OrderServiceMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<OrderDto, IOrder>(
        mapper,
        'OrderDto',
        'IOrder',
        forMemberId,
        forMember(
          (d) => d.userAddress,
          mapWithArguments((s, { userDto }) => {
            const userAddressDto = (userDto as UserDto).addresses.find(
              (a) => a._id === s.userAddressId,
            );
            if (!userAddressDto) {
              return null;
            }
            return mapper.map<UserAddressDto, IUserAddress>(
              userAddressDto,
              'UserAddressDto',
              'IUserAddress',
            );
          }),
        ),
        forMember(
          (d) => d.user,
          mapWithArguments((s, { userDto }) => userDto),
        ),
        forMember(
          (d) => d.userAddress,
          mapWithArguments((s, { userAddress }) => userAddress),
        ),
      );
      createMap<IOrder, OrderDto>(
        mapper,
        'IOrder',
        'OrderDto',
        forMemberId,
        forMember(
          (d) => d.userId,
          mapFrom((s) => s.user?._id),
        ),
        forMember(
          (d) => d.userAddressId,
          mapFrom((s) => s.userAddress?._id),
        ),
      );
    };
  }
}

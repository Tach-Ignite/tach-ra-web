import { Mapper, MappingProfile, createMap } from '@jersmart/automapper-core';
import { IAddress, ITachMappingProfile } from '@/lib/abstractions';
import {
  AddressViewModel,
  IUser,
  IUserAddress,
  UserAddressViewModel,
  UserViewModel,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';

@TachMappingProfileClass('pages/admin/users/mappingProfile')
export class AdminUsersMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
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
    };
  }
}

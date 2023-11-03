import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import {
  IAddress,
  AddressViewModel,
  AllUserAddressesViewModel,
  MutateUserAddressViewModel,
  IUserAddress,
  UserAddressViewModel,
  AddUserAddressPayload,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import { ITachMappingProfile } from '@/lib/abstractions';

@TachMappingProfileClass('pages/api/addresses/currentUser/mappingProfile')
export class AddressApiCurrentUserMappingProfile
  implements ITachMappingProfile
{
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IAddress, AddressViewModel>(
        mapper,
        'IAddress',
        'AddressViewModel',
        forMemberId,
      );
      createMap<AddressViewModel, IAddress>(
        mapper,
        'AddressViewModel',
        'IAddress',
        forMemberId,
      );
      createMap<MutateUserAddressViewModel, IUserAddress>(
        mapper,
        'MutateUserAddressViewModel',
        'IUserAddress',
        forMemberId,
      );
      createMap<MutateUserAddressViewModel, AddUserAddressPayload>(
        mapper,
        'MutateUserAddressViewModel',
        'AddUserAddressPayload',
        forMember(
          (d) => d.userId,
          mapWithArguments((s, { userId }) => userId),
        ),
        forMember(
          (d) => d.userAddress,
          mapFrom((s) =>
            mapper.map<MutateUserAddressViewModel, IUserAddress>(
              s,
              'MutateUserAddressViewModel',
              'IUserAddress',
            ),
          ),
        ),
      );
      createMap<IUserAddress, UserAddressViewModel>(
        mapper,
        'IUserAddress',
        'UserAddressViewModel',
        forMemberId,
      );
      createMap<IUserAddress[], AllUserAddressesViewModel>(
        mapper,
        'IUserAddress[]',
        'AllUserAddressesViewModel',
        forMember(
          (d) => d.defaultUserAddressId,
          mapWithArguments(
            (s, { defaultUserAddressId }) => defaultUserAddressId,
          ),
        ),
        forMember(
          (d) => d.userAddresses,
          mapFrom((s) =>
            s.map((ua) =>
              mapper.map<IUserAddress, UserAddressViewModel>(
                ua,
                'IUserAddress',
                'UserAddressViewModel',
              ),
            ),
          ),
        ),
      );
    };
  }
}

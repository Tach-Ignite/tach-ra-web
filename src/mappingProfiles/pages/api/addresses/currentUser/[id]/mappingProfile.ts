import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import { ITachMappingProfile, IdModel } from '@/lib/abstractions';
import {
  IAddress,
  AddressViewModel,
  MutateUserAddressViewModel,
  IUserAddress,
  UserAddressViewModel,
  EditUserAddressCommandPayload,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';

@TachMappingProfileClass('pages/api/addresses/currentUser/[id]/mappingProfile')
export class AddressApiCurrentUserIdMappingProfile
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
        forMember(
          (d) => d.address,
          mapFrom((s) => {
            const a = mapper.map<AddressViewModel, IAddress & Partial<IdModel>>(
              s.address,
              'AddressViewModel',
              'IAddress',
            );
            a._id = undefined;
            return a;
          }),
        ),
      );
      createMap<MutateUserAddressViewModel, EditUserAddressCommandPayload>(
        mapper,
        'MutateUserAddressViewModel',
        'EditUserAddressCommandPayload',
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
        forMember(
          (d) => d.userAddressId,
          mapWithArguments((s, { userAddressId }) => userAddressId),
        ),
      );
      createMap<IUserAddress, UserAddressViewModel>(
        mapper,
        'IUserAddress',
        'UserAddressViewModel',
        forMemberId,
      );
    };
  }
}

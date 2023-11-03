import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import { UserDto, IUser } from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import { ITachMappingProfile } from '@/lib/abstractions';
import '../userAddresses/mappingProfile';

@TachMappingProfileClass('services/users/mappingProfile')
export class AddressApiCurrentUserMappingProfile
  implements ITachMappingProfile
{
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
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
      );
    };
  }
}

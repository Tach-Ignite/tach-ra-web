import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapWithArguments,
} from '@jersmart/automapper-core';
import { IAddress, AddressDto, IUserAddress, UserAddressDto } from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import { ITachMappingProfile } from '@/lib/abstractions';

@TachMappingProfileClass('services/userAddresses/mappingProfile')
export class AddressApiCurrentUserMappingProfile
  implements ITachMappingProfile
{
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<AddressDto, IAddress>(
        mapper,
        'AddressDto',
        'IAddress',
        forMemberId,
      );
      createMap<UserAddressDto, IUserAddress>(
        mapper,
        'UserAddressDto',
        'IUserAddress',
        forMemberId,
        forMember(
          (d) => d.address,
          mapWithArguments((s, { address }) =>
            mapper.map<AddressDto, IAddress>(
              address as AddressDto,
              'AddressDto',
              'IAddress',
            ),
          ),
        ),
      );
    };
  }
}

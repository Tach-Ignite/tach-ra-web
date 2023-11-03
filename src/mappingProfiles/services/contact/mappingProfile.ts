import { Mapper, MappingProfile, createMap } from '@jersmart/automapper-core';
import { IContactRequest, ContactRequestDto } from '@/models';
import { TachMappingProfileClass } from '@/lib/mapping';
import { ITachMappingProfile } from '@/lib/abstractions';

@TachMappingProfileClass('services/contact/mappingProfile')
export class AddressApiCurrentUserMappingProfile
  implements ITachMappingProfile
{
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IContactRequest, ContactRequestDto>(
        mapper,
        'IContactRequest',
        'ContactRequestDto',
      );
    };
  }
}

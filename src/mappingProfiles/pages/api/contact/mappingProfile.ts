import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@jersmart/automapper-core';
import {
  ITachMappingProfile,
  ValidateRecaptchaTokenCommandPayload,
} from '@/lib/abstractions';
import { TachMappingProfileClass } from '@/lib/mapping';
import {
  ContactRequestViewModel,
  CreateContactRequestCommandPayload,
  IContactRequest,
} from '@/models';

@TachMappingProfileClass('pages/api/contact/mappingProfile')
export class ContactUsApiMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<ContactRequestViewModel, ValidateRecaptchaTokenCommandPayload>(
        mapper,
        'ContactRequestViewModel',
        'ValidateRecaptchaTokenCommandPayload',
      );
      createMap<ContactRequestViewModel, IContactRequest>(
        mapper,
        'ContactRequestViewModel',
        'IContactRequest',
      );
      createMap<ContactRequestViewModel, CreateContactRequestCommandPayload>(
        mapper,
        'ContactRequestViewModel',
        'CreateContactRequestCommandPayload',
        forMember(
          (d) => d.contactRequest,
          mapFrom((s) =>
            mapper.map<ContactRequestViewModel, IContactRequest>(
              s,
              'ContactRequestViewModel',
              'IContactRequest',
            ),
          ),
        ),
      );
    };
  }
}

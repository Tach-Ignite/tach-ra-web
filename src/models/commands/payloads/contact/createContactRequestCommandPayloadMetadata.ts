import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { CreateContactRequestCommandPayload } from './createContactRequestCommandPayload';

export function createContactRequestCommandPayloadMetadata() {
  PojosMetadataMap.create<CreateContactRequestCommandPayload>(
    'CreateContactRequestCommandPayload',
    {
      contactRequest: 'IContactRequest',
    },
  );
}

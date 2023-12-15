import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { CreateInterestListCommandPayload } from './createInterestListCommandPayload';
import { CreateInterestListItemCommandPayload } from './createInterestListItemCommandPayload';

export function createInterestListCommandPayloadMetadata() {
  PojosMetadataMap.create<CreateInterestListCommandPayload>(
    'CreateInterestListCommandPayload',
    {
      interestList: 'IInterestList',
    },
  );
  PojosMetadataMap.create<CreateInterestListItemCommandPayload>(
    'UpdateOrderPaymentStatusCommandPayload',
    {
      interestListItem: 'IInterestListItem',
    },
  );
}

import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { AddUserAddressPayload } from './addUserAddressPayload';
import { DeleteUserAddressPayload } from './deleteUserAddressPayload';
import { EditUserAddressCommandPayload } from './editUserAddressPayload';

export function createUserAddressPayloadMetadata() {
  PojosMetadataMap.create<AddUserAddressPayload>('AddUserAddressPayload', {
    userId: String,
    userAddress: 'IUserAddress',
    setAsDefault: Boolean,
  });
  PojosMetadataMap.create<DeleteUserAddressPayload>(
    'DeleteUserAddressPayload',
    {
      userId: String,
      userAddressId: String,
    },
  );
  PojosMetadataMap.create<EditUserAddressCommandPayload>(
    'EditUserAddressCommandPayload',
    {
      userId: String,
      userAddressId: String,
      userAddress: 'IUserAddress',
      setAsDefault: Boolean,
    },
  );
}

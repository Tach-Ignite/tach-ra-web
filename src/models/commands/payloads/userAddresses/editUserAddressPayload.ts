import { IUserAddress } from '../../../domain/userAddress';

export type EditUserAddressCommandPayload = {
  userId: string;
  userAddressId: string;
  userAddress: IUserAddress;
  setAsDefault: boolean;
};

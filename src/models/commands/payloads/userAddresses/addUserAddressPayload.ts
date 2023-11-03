import { IUserAddress } from '../../../domain/userAddress';

export type AddUserAddressPayload = {
  userId: string;
  userAddress: IUserAddress;
  setAsDefault: boolean;
};

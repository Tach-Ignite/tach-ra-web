import { IAddress, IUserAddress } from '@/models';

export interface IUserAddressService {
  getUserAddress(
    userId: string,
    recipientName: string,
    addressId: string,
  ): Promise<IUserAddress>;
  getUserAddressByUserAddressId(
    userId: string,
    userAddressId: string,
  ): Promise<IUserAddress>;
  getAllUserAddresses(userId: string): Promise<IUserAddress[]>;
  addUserAddress(
    userId: string,
    address: IAddress,
    recipientName: string,
    setAsDefault: boolean,
  ): Promise<IUserAddress>;
  editUserAddress(
    userId: string,
    userAddressId: string,
    address: IAddress,
    recipientName: string,
    setAsDefault: boolean,
  ): Promise<IUserAddress>;
  deleteUserAddress(userId: string, userAddressId: string): Promise<void>;
}

import { IUserRolesEnum } from '../enums';
import { IUserAddress } from './userAddress';

export interface IUser {
  _id?: string;
  name: string;
  image?: string;
  emailVerified?: Date | null;
  roles: Extract<keyof IUserRolesEnum, string>[];
  email: string;
  phoneNumber?: string;
  agreedToReceiveSmsNotifications: boolean;
  defaultUserAddressId?: string | null;
  addresses: IUserAddress[];
}

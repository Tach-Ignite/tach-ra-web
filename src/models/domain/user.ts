import { IUserRolesEnum } from '../enums';
import { ICart } from './cart';
import { IUserAddress } from './userAddress';

export interface IUser {
  _id?: string;
  name: string;
  image?: string;
  emailVerified?: Date | null;
  roles: Extract<keyof IUserRolesEnum, string>[];
  email: string;
  phoneNumber?: string;
  agreedToReceiveSmsNotifications?: boolean;
  smsOptInConfirmedViaSms?: boolean;
  smsOptInConfirmedViaSmsDate?: Date;
  smsOptedOutViaSms?: boolean;
  smsOptedOutViaSmsDate?: Date;
  defaultUserAddressId?: string | null;
  addresses: IUserAddress[];
  cart: ICart;
  disabled?: boolean;
}

import {
  ILineItem,
  IPaymentStatusEnum,
  PartialIdModelAndTimestampModel,
} from '@/lib/abstractions';
import { IOrderStatusEnum } from '../enums';
import { IUserAddress } from './userAddress';
import { IUser } from './user';

export interface IOrder extends PartialIdModelAndTimestampModel {
  user: IUser;
  userAddress: IUserAddress;
  lineItems: ILineItem[];
  paymentStatus: Extract<keyof IPaymentStatusEnum, string>;
  orderStatus: Extract<keyof IOrderStatusEnum, string>;
}

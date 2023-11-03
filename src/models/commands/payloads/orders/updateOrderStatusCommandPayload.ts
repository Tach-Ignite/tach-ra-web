import { IOrderStatusEnum } from '../../../enums/orderEnums';

export type UpdateOrderStatusCommandPayload = {
  orderId: string;
  orderStatus: Extract<keyof IOrderStatusEnum, string>;
};

import { IOrder } from '../../../domain/order';

export type CreateOrderCommandPayload = {
  order: IOrder;
};

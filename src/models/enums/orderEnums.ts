import { IEnum } from '@/lib/abstractions';
import { EnumFactory } from '@/lib/enums';

const enumFactory = new EnumFactory();

export interface IOrderStatusEnum extends IEnum {
  Created: string;
  Processed: string;
  Shipped: string;
  Delivered: string;
}

export const OrderStatusEnum: IOrderStatusEnum = enumFactory.create({
  Created: 'Created',
  Processed: 'Processed',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
}) as IOrderStatusEnum;

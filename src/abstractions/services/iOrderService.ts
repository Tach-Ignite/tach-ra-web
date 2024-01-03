import { IPaymentStatusEnum } from '@/lib/abstractions';
import { IOrder, IOrderStatusEnum } from '@/models';

export interface IOrderService {
  getOrderById(orderId: string): Promise<IOrder>;
  getAllOrders(): Promise<IOrder[]>;
  getAllOrdersByUserId(userId: string): Promise<IOrder[]>;
  createOrder(order: IOrder): Promise<IOrder>;
  updateOrderStatus(
    orderId: string,
    orderStatus: keyof IOrderStatusEnum,
  ): Promise<IOrder>;
  updatePaymentStatus(
    orderId: string,
    checkoutSessionId: string,
    paymentStatus: Extract<keyof IPaymentStatusEnum, string>,
    paymentProvider: string,
  ): Promise<IOrder>;
  deleteOrdersByUserId(userId: string): Promise<void>;
}

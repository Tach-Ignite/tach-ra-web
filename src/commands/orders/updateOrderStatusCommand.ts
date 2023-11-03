import { IOrderService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { IOrder, UpdateOrderStatusCommandPayload } from '@/models';

@Injectable('updateOrderStatusCommand', 'orderService', 'payload')
export class UpdateOrderStatusCommand extends Command<
  UpdateOrderStatusCommandPayload,
  IOrder
> {
  private _orderService: IOrderService;

  constructor(
    orderService: IOrderService,
    payload: UpdateOrderStatusCommandPayload,
  ) {
    super(payload);
    this._orderService = orderService;
  }

  async execute(): Promise<void> {
    this.result = await this._orderService.updateOrderStatus(
      this._payload.orderId,
      this._payload.orderStatus,
    );
  }
}

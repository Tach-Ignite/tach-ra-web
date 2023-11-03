import { IOrderService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { IOrder, UpdateOrderPaymentStatusCommandPayload } from '@/models';

@Injectable('updateOrderPaymentStatusCommand', 'orderService', 'payload')
export class UpdateOrderPaymentStatusCommand extends Command<
  UpdateOrderPaymentStatusCommandPayload,
  IOrder
> {
  private _orderService: IOrderService;

  constructor(
    orderService: IOrderService,
    payload: UpdateOrderPaymentStatusCommandPayload,
  ) {
    super(payload);
    this._orderService = orderService;
  }

  async execute(): Promise<void> {
    this.result = await this._orderService.updatePaymentStatus(
      this._payload.orderId,
      this._payload.checkoutSessionId,
      this._payload.paymentStatus,
      this._payload.paymentProvider,
    );
  }
}

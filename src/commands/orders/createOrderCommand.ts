import { IOrderService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { IOrder, CreateOrderCommandPayload } from '@/models';

@Injectable('createOrderCommand', 'orderService', 'payload')
export class CreateOrderCommand extends Command<
  CreateOrderCommandPayload,
  IOrder
> {
  private _orderService: IOrderService;

  constructor(orderService: IOrderService, payload: CreateOrderCommandPayload) {
    super(payload);
    this._orderService = orderService;
  }

  async execute(): Promise<void> {
    this.result = await this._orderService.createOrder(this._payload.order);
  }
}

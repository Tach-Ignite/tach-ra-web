import {
  CreateOrderCommand,
  UpdateOrderPaymentStatusCommand,
  UpdateOrderStatusCommand,
} from '@/commands/orders';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { OrderServiceModule } from '@/modules/services/orders/orderService.module';

@Module
export class OrderCommandsModule extends ModuleClass {
  constructor() {
    super({
      imports: [OrderServiceModule],
      providers: [
        {
          provide: 'createOrderCommand',
          useClass: CreateOrderCommand,
        },
        {
          provide: 'updateOrderPaymentStatusCommand',
          useClass: UpdateOrderPaymentStatusCommand,
        },
        {
          provide: 'updateOrderStatusCommand',
          useClass: UpdateOrderStatusCommand,
        },
      ],
    });
  }
}

import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { CreateOrderCommandPayload } from './createOrderCommandPayload';
import { UpdateOrderPaymentStatusCommandPayload } from './updateOrderPaymentStatusCommandPayload';
import { UpdateOrderStatusCommandPayload } from './updateOrderStatusCommandPayload';

export function createOrderPayloadMetadata() {
  PojosMetadataMap.create<CreateOrderCommandPayload>(
    'CreateOrderCommandPayload',
    {
      order: 'IOrder',
    },
  );
  PojosMetadataMap.create<UpdateOrderPaymentStatusCommandPayload>(
    'UpdateOrderPaymentStatusCommandPayload',
    {
      orderId: String,
      checkoutSessionId: String,
      paymentStatus: String,
      paymentProvider: String,
    },
  );
  PojosMetadataMap.create<UpdateOrderStatusCommandPayload>(
    'UpdateOrderStatusCommandPayload',
    {
      orderId: String,
      orderStatus: String,
    },
  );
}

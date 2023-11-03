import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  ICommandFactory,
  IInvoker,
  IMapper,
  IProvider,
  IServerIdentity,
} from '@/lib/abstractions';
import '@/mappingProfiles/pages/api/orders/mappingProfile';
import { defaultHandler } from '@/lib/api';
import {
  IOrder,
  OrderViewModel,
  UpdateOrderStatusCommandPayload,
  UpdateOrderStatusViewModel,
  UserRolesEnum,
} from '@/models';
import { ErrorWithStatusCode } from '@/lib/errors';
import { IOrderService } from '@/abstractions';
import { ModuleResolver } from '@/lib/ioc/';
import { OrdersApiModule } from '@/modules/pages/api/orders/ordersApi.module';

const m = new ModuleResolver().resolve(OrdersApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const orderService = m.resolve<IOrderService>('orderService');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.patch(
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const userIsAdmin = await serverIdentity.userHasRole(
      req,
      res,
      UserRolesEnum.Admin,
    );
    if (!userIsAdmin) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to query users.' });
    }

    const orderId = req.query.id as string;
    const updateOrderStatusViewModel = req.body as UpdateOrderStatusViewModel;

    const payload = mapper.map<
      UpdateOrderStatusViewModel,
      UpdateOrderStatusCommandPayload
    >(
      updateOrderStatusViewModel,
      'UpdateOrderStatusViewModel',
      'UpdateOrderStatusCommandPayload',
      { extraArgs: () => ({ orderId }) },
    );

    const command = commandFactory.create<
      UpdateOrderStatusCommandPayload,
      IOrder
    >('updateOrderStatusCommand', payload);
    const result = await invoker.invoke(command);

    if (!result) {
      throw new ErrorWithStatusCode(
        'Update order status command did not return a value.',
        500,
        'Failed to update order.',
      );
    }

    const viewModel = mapper.map<IOrder, OrderViewModel>(
      result,
      'IOrder',
      'OrderViewModel',
    );

    return res.status(200).json(viewModel);
  },
);

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const userIsAdmin = await serverIdentity.userHasRole(
    req,
    res,
    UserRolesEnum.Admin,
  );
  if (!userIsAdmin) {
    return res
      .status(403)
      .json({ error: 'You do not have permission to query users.' });
  }

  const orderId = req.query.id as string;

  const order = await orderService.getOrderById(orderId);

  if (!order) {
    throw new ErrorWithStatusCode(
      `Order with id '${orderId}' not found.`,
      404,
      'Order not found.',
    );
  }

  const viewModel = mapper.map<IOrder, OrderViewModel>(
    order,
    'IOrder',
    'OrderViewModel',
  );

  return res.status(200).json(viewModel);
});

export default router.handler(defaultHandler);

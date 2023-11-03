import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { IMapper, IProvider, IServerIdentity } from '@/lib/abstractions';
import '@/mappingProfiles/pages/api/orders/mappingProfile';
import { defaultHandler } from '@/lib/api';
import { IOrder, OrderViewModel, UserRolesEnum } from '@/models';
import { IOrderService } from '@/abstractions';
import { ModuleResolver } from '@/lib/ioc/';
import { OrdersApiModule } from '@/modules/pages/api/orders/ordersApi.module';

const m = new ModuleResolver().resolve(OrdersApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const orderService = m.resolve<IOrderService>('orderService');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  if (!serverIdentity.userHasRole(req, res, UserRolesEnum.Admin)) {
    return res
      .status(403)
      .json({ error: 'You do not have permission to query orders.' });
  }

  const orders = await orderService.getAllOrders();

  const viewModels = mapper.mapArray<IOrder, OrderViewModel>(
    orders,
    'IOrder',
    'OrderViewModel',
  );

  return res.status(200).json(viewModels);
});

export default router.handler(defaultHandler);

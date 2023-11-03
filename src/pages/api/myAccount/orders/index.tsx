import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { IOrderService } from '@/abstractions';
import { IMapper, IProvider, IServerIdentity } from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import { IOrder, OrderViewModel } from '@/models';
import '@/mappingProfiles/pages/api/orders/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { MyAccountApiModule } from '@/modules/pages/api/myAccount/orders/myAccountApi.module';

const m = new ModuleResolver().resolve(MyAccountApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const orderService = m.resolve<IOrderService>('orderService');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const orders = await orderService.getAllOrdersByUserId(user._id);

  const mapper = automapperProvider.provide();
  const orderViewModels = mapper.mapArray<IOrder, OrderViewModel>(
    orders,
    'IOrder',
    'OrderViewModel',
  );

  return res.status(200).json(orderViewModels);
});

export default router.handler(defaultHandler);

import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { IUserService } from '@/abstractions';
import { IServerIdentity } from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import '@/mappingProfiles/pages/api/orders/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { MyAccountOrdersApiModule } from '@/modules/pages/api/myAccount/orders/myAccountOrdersApi.module';

const m = new ModuleResolver().resolve(MyAccountOrdersApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const userService = m.resolve<IUserService>('userService');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const promises: Promise<any>[] = [];
  promises.push(userService.deleteUserAndAccount(user._id));

  return res.status(204).end();
});

export default router.handler(defaultHandler);

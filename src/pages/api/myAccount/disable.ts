import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { IOrderService, IUserService } from '@/abstractions';
import {
  ICommandFactory,
  IFactory,
  IInvoker,
  IMapper,
  IProvider,
  IServerIdentity,
  ISmsService,
} from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import {
  IUser,
  MutateUserProfileViewModel,
  SetUserProfileCommandPayload,
  UserViewModel,
} from '@/models';
import '@/mappingProfiles/pages/api/orders/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { MyAccountOrdersApiModule } from '@/modules/pages/api/myAccount/orders/myAccountOrdersApi.module';
import { ErrorWithStatusCode } from '@/lib/errors';
import { UsersApiModule } from '@/modules/pages/api/users/usersApi.module';

const m = new ModuleResolver().resolve(MyAccountOrdersApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const userService = m.resolve<IUserService>('userService');
const smsServiceFactory = m.resolve<IFactory<ISmsService>>('smsServiceFactory');
const smsService = smsServiceFactory.create();
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await userService.disableUser(user._id);

  return res.status(204).end();
});

export default router.handler(defaultHandler);

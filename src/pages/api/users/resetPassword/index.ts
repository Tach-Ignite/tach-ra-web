import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  IMapper,
  IProvider,
  ICommandFactory,
  IInvoker,
} from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import {
  RequestPasswordResetViewModel,
  SendPasswordResetRequestCommandPayload,
} from '@/models';
import '@/mappingProfiles/pages/api/users/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { UsersApiModule } from '@/modules/pages/api/users/usersApi.module';

const m = new ModuleResolver().resolve(UsersApiModule);
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { email }: RequestPasswordResetViewModel = req.body;

  const mapper = automapperProvider.provide();
  const sendPasswordResetRequestCommandPayload = mapper.map<
    string,
    SendPasswordResetRequestCommandPayload
  >(email, 'string', 'SendPasswordResetRequestCommandPayload');

  const command = commandFactory.create<
    SendPasswordResetRequestCommandPayload,
    void
  >('sendPasswordResetRequestCommand', sendPasswordResetRequestCommandPayload);
  await invoker.invoke(command);

  return res.status(204).end();
});

export default router.handler(defaultHandler);

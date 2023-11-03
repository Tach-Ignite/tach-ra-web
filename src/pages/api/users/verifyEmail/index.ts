import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  ICommandFactory,
  IInvoker,
  IMapper,
  IProvider,
} from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import { VerifyEmailAddressCommandPayload } from '@/models';
import '@/mappingProfiles/pages/api/users/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { UsersApiModule } from '@/modules/pages/api/users/usersApi.module';

const m = new ModuleResolver().resolve(UsersApiModule);
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const validationToken = req.body;

  const mapper = automapperProvider.provide();
  const verifyEmailAddressCommandPayload = mapper.map<
    string,
    VerifyEmailAddressCommandPayload
  >(validationToken, 'string', 'VerifyEmailAddressCommandPayload');

  const command = commandFactory.create<VerifyEmailAddressCommandPayload, void>(
    'verifyEmailAddressCommand',
    verifyEmailAddressCommandPayload,
  );
  await invoker.invoke(command);

  return res.status(204).end();
});

export default router.handler(defaultHandler);

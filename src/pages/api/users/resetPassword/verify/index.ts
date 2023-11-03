import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  IMapper,
  IProvider,
  ICommandFactory,
  IInvoker,
} from '@/lib/abstractions';
import { ResetPasswordCommandPayload, ResetPasswordViewModel } from '@/models';
import '@/mappingProfiles/pages/api/users/mappingProfile';
import { defaultHandler } from '@/lib/api';
import { ModuleResolver } from '@/lib/ioc/';
import { UsersApiModule } from '@/modules/pages/api/users/usersApi.module';

const m = new ModuleResolver().resolve(UsersApiModule);
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const resetPasswordViewModel = req.body;

  const mapper = automapperProvider.provide();
  const resetPasswordCommandPayload = mapper.map<
    ResetPasswordViewModel,
    ResetPasswordCommandPayload
  >(
    resetPasswordViewModel,
    'ResetPasswordViewModel',
    'ResetPasswordCommandPayload',
  );

  const command = commandFactory.create<ResetPasswordCommandPayload, void>(
    'resetPasswordCommand',
    resetPasswordCommandPayload,
  );
  await invoker.invoke(command);

  return res.status(204).end();
});

export default router.handler(defaultHandler);

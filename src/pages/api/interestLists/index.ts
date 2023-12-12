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
import { defaultHandler } from '@/lib/api';
import '@/mappingProfiles/pages/api/users/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { InterestListsApiModule } from '@/modules/pages/api/interestLists/interestListsApi.module';
import { IInterestListService } from '@/abstractions/services/iInterestListService';

const m = new ModuleResolver().resolve(InterestListsApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const interestListService = m.resolve<IInterestListService>(
  'interestListService',
);
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    throw new Error('Not implemented');
  },
);

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  throw new Error('Not implemented');
});

export default router.handler(defaultHandler);

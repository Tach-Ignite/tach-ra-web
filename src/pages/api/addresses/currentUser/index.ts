import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  IProvider,
  IMapper,
  ICommandFactory,
  IInvoker,
  IServerIdentity,
} from '@/lib/abstractions';
import {
  AllUserAddressesViewModel,
  MutateUserAddressViewModel,
  IUserAddress,
  UserAddressViewModel,
  AddUserAddressPayload,
} from '@/models';
import { IUserAddressService } from '@/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { defaultHandler } from '@/lib/api';
import '@/mappingProfiles/pages/api/addresses/currentUser/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { CurrentUserAddressesApiModule } from '@/modules/pages/api/addresses/currentUser/currentUserAddressesApi.module';

export const revalidate = 10;

const m = new ModuleResolver().resolve(CurrentUserAddressesApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const userAddressService = m.resolve<IUserAddressService>('userAddressService');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);
  if (!user) {
    return res.status(403).json({ error: 'No user logged in.' });
  }

  const createAddressApiRequest = req.body as MutateUserAddressViewModel;
  const payload = mapper.map<MutateUserAddressViewModel, AddUserAddressPayload>(
    createAddressApiRequest,
    'MutateUserAddressViewModel',
    'AddUserAddressPayload',
    { extraArgs: () => ({ userId: user._id }) },
  );

  const command = commandFactory.create<AddUserAddressPayload, IUserAddress>(
    'addUserAddressCommand',
    payload,
  );
  const result = await invoker.invoke<IUserAddress>(command);

  if (!result) {
    throw new ErrorWithStatusCode('Command did yield a result.', 500);
  }

  const viewModel = mapper.map<IUserAddress, UserAddressViewModel>(
    result,
    'IUserAddress',
    'UserAddressViewModel',
  );

  return res.status(200).json(viewModel);
});

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);
  if (!user) {
    return res.status(403).json({ error: 'No user logged in.' });
  }
  const userAddresses = await userAddressService.getAllUserAddresses(user._id);

  const allUserAddressesViewModel = mapper.map<
    IUserAddress[],
    AllUserAddressesViewModel
  >(userAddresses, 'IUserAddress[]', 'AllUserAddressesViewModel', {
    extraArgs: () => ({ defaultUserAddressId: user.defaultUserAddressId }),
  });

  return res.status(200).json(allUserAddressesViewModel);
});

export default router.handler(defaultHandler);

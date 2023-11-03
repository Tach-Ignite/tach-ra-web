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
import { defaultHandler } from '@/lib/api';
import {
  MutateUserAddressViewModel,
  IUserAddress,
  UserAddressViewModel,
  EditUserAddressCommandPayload,
  DeleteUserAddressPayload,
} from '@/models';
import { ErrorWithStatusCode } from '@/lib/errors';
import { IUserAddressService } from '@/abstractions';
import '@/mappingProfiles/pages/api/addresses/currentUser/[id]/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { CurrentUserAddressesApiModule } from '@/modules/pages/api/addresses/currentUser/currentUserAddressesApi.module';

const m = new ModuleResolver().resolve(CurrentUserAddressesApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const userAddressService = m.resolve<IUserAddressService>('userAddressService');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);

  if (!user) {
    return res.status(403).json({ error: 'No user logged in.' });
  }
  const userAddressId = req.query.id as string;

  const userAddress = await userAddressService.getUserAddressByUserAddressId(
    user._id,
    userAddressId,
  );

  return res.status(200).json(userAddress);
});

router.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);
  if (!user) {
    return res.status(403).json({ error: 'No user logged in.' });
  }

  const mutateUserAddressViewModel = req.body as MutateUserAddressViewModel;
  const oldUserAddressId = req.query.id as string;

  const payload = mapper.map<
    MutateUserAddressViewModel,
    EditUserAddressCommandPayload
  >(
    mutateUserAddressViewModel,
    'MutateUserAddressViewModel',
    'EditUserAddressCommandPayload',
    {
      extraArgs: () => ({ userId: user._id, userAddressId: oldUserAddressId }),
    },
  );

  const command = commandFactory.create<
    EditUserAddressCommandPayload,
    IUserAddress
  >('editUserAddressCommand', payload);
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

router.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);
  if (!user) {
    return res.status(403).json({ error: 'No user logged in.' });
  }

  const payload = {
    userId: user._id,
    userAddressId: req.query.id as string,
  } as DeleteUserAddressPayload;

  const command = commandFactory.create<DeleteUserAddressPayload, void>(
    'deleteUserAddressCommand',
    payload,
  );

  await invoker.invoke<void>(command);

  return res.status(204).end();
});

export default router.handler(defaultHandler);

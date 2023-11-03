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
import {
  CreateUserCommandPayload,
  CreateUserViewModel,
  IUser,
  UserRolesEnum,
  UserViewModel,
} from '@/models';
import { defaultHandler } from '@/lib/api';
import { IUserService } from '@/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import '@/mappingProfiles/pages/api/users/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { UsersApiModule } from '@/modules/pages/api/users/usersApi.module';

const m = new ModuleResolver().resolve(UsersApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const userService = m.resolve<IUserService>('userService');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const createUserViewModel = req.body;

    const mapper = automapperProvider.provide();
    const createUserCommandPayload = mapper.map<
      CreateUserViewModel,
      CreateUserCommandPayload
    >(createUserViewModel, 'CreateUserViewModel', 'CreateUserCommandPayload');

    const command = commandFactory.create<CreateUserCommandPayload, IUser>(
      'createUserCommand',
      createUserCommandPayload,
    );
    const result = await invoker.invoke(command);

    if (!result) {
      throw new ErrorWithStatusCode(
        'The create user command did not return a result.',
        500,
        'There was an error creating the user. Please try again later.',
      );
    }

    const userViewModel = mapper.map<IUser, UserViewModel>(
      result,
      'IUser',
      'UserViewModel',
    );

    return res.status(200).json(userViewModel);
  },
);

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const userIsAdmin = await serverIdentity.userHasRole(
    req,
    res,
    UserRolesEnum.Admin,
  );
  if (!userIsAdmin) {
    return res
      .status(403)
      .json({ error: 'You do not have permission to query users.' });
  }

  const users = await userService.getAllUsers();

  const mapper = automapperProvider.provide();

  const userViewModels = mapper.mapArray<IUser, UserViewModel>(
    users,
    'IUser',
    'UserViewModel',
  );

  return res.status(200).json(userViewModels);
});

export default router.handler(defaultHandler);

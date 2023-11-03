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
import '@/mappingProfiles/pages/api/users/[id]/mappingProfile';
import { ErrorWithStatusCode } from '@/lib/errors';
import { defaultHandler } from '@/lib/api';
import {
  IUser,
  SetUserRolesCommandPayload,
  SetUserRolesViewModel,
  UserRolesEnum,
  UserViewModel,
} from '@/models';
import { IUserService } from '@/abstractions';
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

router.patch(
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const userIsAdmin = await serverIdentity.userHasRole(
      req,
      res,
      UserRolesEnum.Admin,
    );
    if (!userIsAdmin) {
      throw new ErrorWithStatusCode(
        'You do not have permission to edit users.',
        403,
      );
    }

    const userId = req.query.id as string;
    const setUserRolesViewModel = req.body as SetUserRolesViewModel;

    const mapper = automapperProvider.provide();
    const setUserRolesCommandPayload = mapper.map<
      SetUserRolesViewModel,
      SetUserRolesCommandPayload
    >(
      setUserRolesViewModel,
      'SetUserRolesViewModel',
      'SetUserRolesCommandPayload',
      { extraArgs: () => ({ userId }) },
    );

    const command = commandFactory.create<SetUserRolesCommandPayload, IUser>(
      'setUserRolesCommand',
      setUserRolesCommandPayload,
    );
    const result = await invoker.invoke(command);

    if (!result) {
      throw new ErrorWithStatusCode(
        'Set user roles command invocation failed to return a result.',
        500,
        'An error occurred while updating the user.',
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

  const userId = req.query.id as string;

  const user = await userService.getUserById(userId);

  if (!user) {
    throw new ErrorWithStatusCode('User not found.', 404, 'User not found.');
  }

  const mapper = automapperProvider.provide();
  const userViewModel = mapper.map<IUser, UserViewModel>(
    user,
    'IUser',
    'UserViewModel',
  );

  return res.status(200).json(userViewModel);
});

export default router.handler(defaultHandler);

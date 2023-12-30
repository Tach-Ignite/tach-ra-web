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
import { MyAccountApiModule } from '@/modules/pages/api/myAccount/orders/myAccountApi.module';
import { ErrorWithStatusCode } from '@/lib/errors';
import { UsersApiModule } from '@/modules/pages/api/users/usersApi.module';

const m = new ModuleResolver().resolve(MyAccountApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const userService = m.resolve<IUserService>('userService');
const smsServiceFactory = m.resolve<IFactory<ISmsService>>('smsServiceFactory');
const smsService = smsServiceFactory.create();
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.patch(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await serverIdentity.getUser(req, res);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const mapper = automapperProvider.provide();
  const payload = mapper.map<
    MutateUserProfileViewModel,
    SetUserProfileCommandPayload
  >(
    req.body as MutateUserProfileViewModel,
    'MutateUserProfileViewModel',
    'SetUserProfileCommandPayload',
    {
      extraArgs: () => ({ userId: user.id }),
    },
  );

  const command = commandFactory.create<SetUserProfileCommandPayload, IUser>(
    'setUserProfileCommand',
    payload,
  );
  const result = await invoker.invoke(command);

  if (result === undefined) {
    throw new ErrorWithStatusCode(
      'The set user profile command did not return a result.',
      500,
      'There was an error setting the user profile. Please try again later.',
    );
  }

  const userViewModel = mapper.map<IUser, UserViewModel>(
    result,
    'IUser',
    'UserViewModel',
  );

  if (payload.agreedToReceiveSmsNotifications && payload.phoneNumber) {
    await smsService.sendSms(
      payload.phoneNumber,
      'Welcome to Tach Ignite! You have opted in to receive SMS messages from us. Reply IN to confirm or STOP to opt out.',
    );
  }

  return res.status(200).json(userViewModel);
});

export default router.handler(defaultHandler);

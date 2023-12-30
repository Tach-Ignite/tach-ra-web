import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  IProvider,
  IMapper,
  ICommandFactory,
  IInvoker,
  IServerIdentity,
  CreatePaymentIntentCommandPayload,
  ICreateCheckoutSessionResponse,
} from '@/lib/abstractions';
import '@/mappingProfiles/pages/api/checkout/mappingProfile';
import { CheckoutViewModel, CreateOrderCommandPayload, IOrder } from '@/models';
import { ErrorWithStatusCode } from '@/lib/errors';
import { defaultHandler } from '@/lib/api';
import { IUserService } from '@/abstractions';
import { ModuleResolver } from '@/lib/ioc/';
import { CheckoutApiModule } from '@/modules/pages/api/checkout/checkoutApi.module';

const m = new ModuleResolver().resolve(CheckoutApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const userService = m.resolve<IUserService>('userService');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const loggedInUser = await serverIdentity.getUser(req, res);
  if (!loggedInUser) {
    return res.status(401).end('Unauthorized');
  }
  const { _id: userId } = loggedInUser;
  if (!userId) {
    return res.status(403).end('Forbidden');
  }

  const checkoutViewModel = req.body as CheckoutViewModel;

  const user = await userService.getUserById(userId);

  const createOrderCommandPayload = mapper.map<
    CheckoutViewModel,
    CreateOrderCommandPayload
  >(checkoutViewModel, 'CheckoutViewModel', 'CreateOrderCommandPayload', {
    extraArgs: () => ({ user }),
  });

  const command = commandFactory.create<CreateOrderCommandPayload, IOrder>(
    'createOrderCommand',
    createOrderCommandPayload,
  );

  const createOrderResult = await invoker.invoke(command);

  if (!createOrderResult) {
    throw new ErrorWithStatusCode(
      'Create order command did not return a result.',
      500,
      'Internal Server Error',
    );
  }

  const createPaymentIntentCommandPayload = mapper.map<
    IOrder,
    CreatePaymentIntentCommandPayload
  >(createOrderResult, 'IOrder', 'CreatePaymentIntentCommandPayload', {
    extraArgs: () => ({ email: user.email }),
  });

  const createPaymentIntentCommand = commandFactory.create<
    CreatePaymentIntentCommandPayload,
    ICreateCheckoutSessionResponse
  >('createPaymentIntentCommand', createPaymentIntentCommandPayload);

  const createPaymentIntentResult = await invoker.invoke(
    createPaymentIntentCommand,
  );

  if (!createPaymentIntentResult) {
    throw new ErrorWithStatusCode(
      'Create payment intent command did not return a result.',
      500,
      'Internal Server Error',
    );
  }

  return res.status(200).json({ createPaymentIntentResult });
});

export default router.handler(defaultHandler);

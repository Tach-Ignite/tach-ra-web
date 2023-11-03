import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  IProvider,
  IConfirmPaymentIntentRequest,
  IMapper,
  ICommandFactory,
  IInvoker,
  ParseConfirmCheckoutSessionCommandPayload,
  ConfirmCheckoutSessionCommandPayload,
} from '@/lib/abstractions';
import { IOrder, UpdateOrderPaymentStatusCommandPayload } from '@/models';
import { ErrorWithStatusCode } from '@/lib/errors';
import { defaultHandler } from '@/lib/api';
import '@/mappingProfiles/pages/api/checkout/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { CheckoutApiModule } from '@/modules/pages/api/checkout/checkoutApi.module';

const m = new ModuleResolver().resolve(CheckoutApiModule);
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const mapper = automapperProvider.provide();

export const config = {
  api: {
    bodyParser: false,
  },
};

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const parseConfirmCheckoutSessionCommandPayload = mapper.map<
    NextApiRequest,
    ParseConfirmCheckoutSessionCommandPayload
  >(req, 'NextApiRequest', 'ParseConfirmCheckoutSessionCommandPayload');

  const parseConfirmCheckoutSessionCommand = commandFactory.create<
    ParseConfirmCheckoutSessionCommandPayload,
    IConfirmPaymentIntentRequest
  >(
    'parseConfirmCheckoutSessionCommand',
    parseConfirmCheckoutSessionCommandPayload,
  );
  const parseResult = await invoker.invoke(parseConfirmCheckoutSessionCommand);

  // The request wasn't parsable as a confirm payment intent request and therefore should be ignored.
  if (!parseResult) {
    return res.status(204).end();
  }

  const updateOrderPaymentStatusCommandPayload = mapper.map<
    IConfirmPaymentIntentRequest,
    UpdateOrderPaymentStatusCommandPayload
  >(
    parseResult,
    'IConfirmPaymentIntentRequest',
    'UpdateOrderPaymentStatusCommandPayload',
  );

  const updateOrderPaymentStatusResult = commandFactory.create<
    UpdateOrderPaymentStatusCommandPayload,
    IOrder
  >('updateOrderPaymentStatusCommand', updateOrderPaymentStatusCommandPayload);
  const updateOrderResult = await invoker.invoke(
    updateOrderPaymentStatusResult,
  );

  if (!updateOrderResult) {
    throw new ErrorWithStatusCode(
      'Update order command did not return a result.',
      500,
      'Internal Server Error',
    );
  }

  const confirmCheckoutSessionCommandPayload = mapper.map<
    IConfirmPaymentIntentRequest,
    ConfirmCheckoutSessionCommandPayload
  >(
    parseResult,
    'IConfirmPaymentIntentRequest',
    'ConfirmCheckoutSessionCommandPayload',
  );

  const confirmCheckoutSessionCommand = commandFactory.create<
    ConfirmCheckoutSessionCommandPayload,
    void
  >('confirmCheckoutSessionCommand', confirmCheckoutSessionCommandPayload);
  await invoker.invoke(confirmCheckoutSessionCommand);

  return res.status(204).end();
});

export default router.handler(defaultHandler);

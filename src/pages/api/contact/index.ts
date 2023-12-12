import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  ICommandFactory,
  IInvoker,
  IMapper,
  IProvider,
  RecaptchaValidationResponse,
  ValidateRecaptchaTokenCommandPayload,
} from '@/lib/abstractions';
import '@/mappingProfiles/pages/api/contact/mappingProfile';
import {
  ContactRequestViewModel,
  CreateContactRequestCommandPayload,
} from '@/models';
import { ErrorWithStatusCode } from '@/lib/errors';
import { defaultHandler } from '@/lib/api';
import { ModuleResolver } from '@/lib/ioc/';
import { ContactApiModule } from '@/modules/pages/api/contact/contactApi.module';

const m = new ModuleResolver().resolve(ContactApiModule);
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const contactUsViewModel = req.body as ContactRequestViewModel;

  const validateRecaptchaTokenCommandPayload = mapper.map<
    ContactRequestViewModel,
    ValidateRecaptchaTokenCommandPayload
  >(
    contactUsViewModel,
    'ContactRequestViewModel',
    'ValidateRecaptchaTokenCommandPayload',
  );

  const validateRecaptchaTokenCommand = commandFactory.create<
    ValidateRecaptchaTokenCommandPayload,
    RecaptchaValidationResponse
  >('validateRecaptchaTokenCommand', validateRecaptchaTokenCommandPayload);
  const validateRecaptchaResponse =
    await invoker.invoke<RecaptchaValidationResponse>(
      validateRecaptchaTokenCommand,
    );

  if (!validateRecaptchaResponse) {
    throw new ErrorWithStatusCode(
      'The validateRecaptchaTokenCommand invocation did not return a result.',
      500,
      'There was a server error. Please try again later.',
    );
  }

  if (!validateRecaptchaResponse.success) {
    throw new ErrorWithStatusCode(
      `The validateRecaptchaTokenCommand invocation did not return a successful result: ${JSON.stringify(
        validateRecaptchaResponse,
      )}`,
      400,
      'Invalid Captcha',
    );
  }

  const createContactRequestCommandPayload = mapper.map<
    ContactRequestViewModel,
    CreateContactRequestCommandPayload
  >(
    contactUsViewModel,
    'ContactRequestViewModel',
    'CreateContactRequestCommandPayload',
  );
  const createContactRequestCommand = commandFactory.create<
    CreateContactRequestCommandPayload,
    void
  >('createContactRequestCommand', createContactRequestCommandPayload);
  await invoker.invoke<void>(createContactRequestCommand);

  return res.status(204).end();
});

export default router.handler(defaultHandler);

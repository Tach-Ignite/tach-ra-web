import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import Cookies from 'cookies';
import {
  IAsyncMultiProvider,
  IFactory,
  ITokenService,
} from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import { ErrorWithStatusCode } from '@/lib/errors';
import { ModuleResolver } from '@/lib/ioc/';
import { TokenServiceModule } from '@/lib/modules/services/server/security/tokenService.module';
import { SecretsModule } from '@/lib/modules/services/server/security/secrets.module';

const m = new ModuleResolver().resolve(TokenServiceModule);
const tokenService = m.resolve<ITokenService>('tokenService');
const m2 = new ModuleResolver().resolve(SecretsModule);
const secretsProviderFactory = m2.resolve<
  IFactory<IAsyncMultiProvider<string | undefined>>
>('secretsProviderFactory');

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const secretsProvider = secretsProviderFactory.create();
  const username = await secretsProvider.provide(
    'TACH_PASSWORD_PROTECTED_USERNAME',
  );

  if (!username) {
    throw new ErrorWithStatusCode(
      'This site is password protected, but the username and/or password have not been set.',
      500,
    );
  }

  const cookies = new Cookies(req, res, { secure: true });
  const token = cookies.get('__Secure-password-protected.session-token');

  if (token === undefined) {
    return res.status(200).json({ valid: false });
  }

  const isValid = await tokenService.validateToken(token!, username!);

  if (!isValid) {
    cookies.set('__Secure-password-protected.session-token', null);
  }

  return res.status(200).json({ valid: isValid });
});

export default router.handler(defaultHandler);

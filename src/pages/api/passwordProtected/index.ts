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

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const secretsProvider = secretsProviderFactory.create();
  const credentials = req.body;
  const username = await secretsProvider.provide(
    'TACH_PASSWORD_PROTECTED_USERNAME',
  );
  const password = await secretsProvider.provide(
    'TACH_PASSWORD_PROTECTED_PASSWORD',
  );

  if (!username || !password) {
    throw new ErrorWithStatusCode(
      'This site is password protected, but the username and/or password have not been set.',
      500,
    );
  }

  if (
    credentials &&
    credentials.username === username &&
    credentials.password === password
  ) {
    const token = await tokenService.createToken(username!, username!, '7d');
    // 7 days
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const cookies = new Cookies(req, res, { secure: true });
    cookies.set('__Secure-password-protected.session-token', token, {
      expires: sessionExpiry,
      secure: true,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    return res.status(204).end();
  }
  return res.status(401).json({ message: 'Unauthorized' });
});

export default router.handler(defaultHandler);

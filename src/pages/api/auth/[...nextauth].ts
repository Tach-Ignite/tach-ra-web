import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { IAuthOptionsFactory } from '@/lib/abstractions';
import { ModuleResolver } from '@/lib/ioc/';
import { AuthApiModule } from '@/modules/pages/api/auth/authApi.module';

const m = new ModuleResolver().resolve(AuthApiModule);
const _authOptionsFactory =
  m.resolve<IAuthOptionsFactory>('authOptionsFactory');

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, await _authOptionsFactory.create(req, res));
}

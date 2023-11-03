import { Adapter } from 'next-auth/adapters';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextAuthOptions, SessionStrategy, User } from 'next-auth';

export interface INextAuthAdapterFactory {
  create(adapter: Adapter): Adapter;
}

export interface IAuthOptionsFactory {
  create(req: NextApiRequest, res: NextApiResponse): Promise<NextAuthOptions>;
}

export interface IServerIdentity {
  getUser(req: NextApiRequest, res: NextApiResponse): Promise<User | null>;
  userHasRole(
    req: NextApiRequest,
    res: NextApiResponse,
    role: string,
  ): Promise<boolean>;
}

export type Credentials = {
  email: string;
  password: string;
};

export type SessionOptions = {
  strategy: SessionStrategy;
  maxAge: number;
  updateAge: number;
};

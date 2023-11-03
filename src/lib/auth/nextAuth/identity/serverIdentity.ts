import { NextApiRequest, NextApiResponse } from 'next';
import { User, getServerSession } from 'next-auth';
import { IAuthOptionsFactory, IServerIdentity } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('serverIdentity', 'authOptionsFactory')
export class ServerIdentity implements IServerIdentity {
  private _authOptionsFactory: IAuthOptionsFactory;

  constructor(authOptionsFactory: IAuthOptionsFactory) {
    this._authOptionsFactory = authOptionsFactory;
  }

  async getUser(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<User | null> {
    const session = await getServerSession(
      req,
      res,
      await this._authOptionsFactory.create(req, res),
    );
    if (!session) {
      return null;
    }
    return session.user;
  }

  async userHasRole(
    req: NextApiRequest,
    res: NextApiResponse,
    role: string,
  ): Promise<boolean> {
    const session = await getServerSession(
      req,
      res,
      await this._authOptionsFactory.create(req, res),
    );
    if (!session || !session.user || !session.user.roles) {
      return false;
    }
    if (!session!.user.roles.includes(role)) {
      return false;
    }
    return true;
  }
}

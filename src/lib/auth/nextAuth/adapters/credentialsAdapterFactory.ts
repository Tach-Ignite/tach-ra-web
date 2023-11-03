import { Adapter, AdapterSession, AdapterUser } from 'next-auth/adapters';
import { SessionToken } from 'next-auth/core/lib/cookie';
import { User } from 'next-auth';
import { INextAuthAdapterFactory, IQueryRepository } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('adapterFactory', 'sessionRepository', 'nextAuthUserRepository')
export class CredentialsAdapterFactory implements INextAuthAdapterFactory {
  private _sessionRepository: IQueryRepository<AdapterSession>;

  private _userRepository: IQueryRepository<User>;

  constructor(
    sessionRepository: IQueryRepository<AdapterSession>,
    nextAuthUserRepository: IQueryRepository<User>,
  ) {
    this._sessionRepository = sessionRepository;
    this._userRepository = nextAuthUserRepository;
  }

  create(adapter: Adapter): Adapter {
    const that = this;
    return {
      ...adapter,
      async getSessionAndUser(sessionToken: SessionToken) {
        const sessions = await that._sessionRepository.find({
          sessionToken,
        });
        if (!sessions || sessions.length < 1) return null;
        const user = await that._userRepository.getById(sessions[0].userId);
        if (!user) return null;

        const adapterUser: AdapterUser = {
          ...user,
          email: user.email!,
        };

        return { session: sessions[0], user: adapterUser };
      },
    };
  }
}

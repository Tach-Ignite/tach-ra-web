import bcrypt from 'bcryptjs';
import { User } from 'next-auth';
import { CredentialsConfig } from 'next-auth/providers';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Credentials, IQueryRepository, IFactory } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('credentialsProviderFactory', 'nextAuthUserRepository')
export class CredentialsProviderFactory implements IFactory<CredentialsConfig> {
  private _userRepository: IQueryRepository<User>;

  constructor(nextAuthUserRepository: IQueryRepository<User>) {
    this._userRepository = nextAuthUserRepository;
  }

  create(): CredentialsConfig {
    const that = this;
    return CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'e@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<string, string> | undefined,
        req,
      ): Promise<User | null> {
        const { email, password } = credentials as Credentials;
        const users = await that._userRepository.find({ email });
        if (!users || users.length < 1) {
          throw new Error('Invalid email or password');
        }
        const passwordMatches = await bcrypt.compare(
          password,
          users[0].password,
        );
        if (!passwordMatches) {
          throw new Error('Invalid email or password');
        }
        const strippedUser: User = { ...users[0] };
        return strippedUser;
      },
    });
  }
}

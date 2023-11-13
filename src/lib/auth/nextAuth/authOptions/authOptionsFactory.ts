import { randomUUID } from 'crypto';
import {
  Account,
  CallbacksOptions,
  NextAuthOptions,
  Profile,
  SessionStrategy,
  User,
} from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import {
  CredentialsConfig as CredentialsProvider,
  Provider,
} from 'next-auth/providers';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import AzureADProvider from 'next-auth/providers/azure-ad';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { decode, encode } from 'next-auth/jwt';
import {
  SessionOptions,
  IAuthOptionsFactory,
  IFactory,
  IOptions,
  IAuthConfiguration,
  IAsyncMultiProvider,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'authOptionsFactory',
  'adapterFactory',
  'credentialsProviderFactory',
  'authConfigurationOptions',
  'secretsProviderFactory',
)
export class AuthOptionsFactory implements IAuthOptionsFactory {
  private _adapterFactory: IFactory<Adapter>;

  private _credentialsProviderFactory: IFactory<CredentialsProvider>;

  private _authConfigration: IAuthConfiguration;

  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    adapterFactory: IFactory<Adapter>,
    credentialsProviderFactory: IFactory<CredentialsProvider>,
    authConfigurationOptions: IOptions<IAuthConfiguration>,
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._adapterFactory = adapterFactory;
    this._credentialsProviderFactory = credentialsProviderFactory;
    this._authConfigration = authConfigurationOptions.value;
    this._secretsProvider = secretsProviderFactory.create();
  }

  async create(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<NextAuthOptions> {
    const _adapter = this._adapterFactory.create();
    const secret = (await this._secretsProvider.provide('NEXTAUTH_SECRET'))!;
    const session = {
      strategy: 'database' as SessionStrategy,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      updateAge: 24 * 60 * 60, // 24 hours
    };
    const cookies = {
      sessionToken: {
        name: `__Secure-next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
          domain: process.env.TACH_DOMAIN as string,
        },
      },
      callbackUrl: {
        name: `__Secure-next-auth.callback-url`,
        options: {
          sameSite: 'lax',
          path: '/',
          secure: true,
        },
      },
      csrfToken: {
        name: `__Host-next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        },
      },
    };
    const providers = await this.getProviders();
    const callbacks = this.getCallbacks(req, res, session, _adapter);
    const jwt = {
      encode(params: any) {
        if (
          req.query.nextauth?.includes('callback') &&
          req.query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          const cookies = new Cookies(req, res, { secure: true });
          const cookie = cookies.get('__Secure-next-auth.session-token');
          if (cookie) return cookie;
          return '';
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode(params);
      },
      async decode(params: any) {
        if (
          req.query.nextauth?.includes('callback') &&
          req.query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          return null;
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return decode(params);
      },
    };
    const pages = {
      signIn: '/auth/signIn',
      signOut: '/auth/signOut',
      error: '/auth/error', // Error code passed in query string as ?error=
    };
    return {
      adapter: _adapter,
      secret,
      session,
      cookies,
      providers,
      callbacks,
      jwt,
      pages,
    };
  }

  private async getProviders(): Promise<Array<Provider>> {
    const providers: Provider[] = [];
    if (this._authConfigration.providers.includes('credentials')) {
      providers.push(this._credentialsProviderFactory.create());
    }
    if (this._authConfigration.providers.includes('google')) {
      providers.push(
        GoogleProvider({
          clientId: process.env.TACH_GOOGLE_CLIENT_ID as string,
          clientSecret: (await this._secretsProvider.provide(
            'TACH_GOOGLE_CLIENT_SECRET',
          ))!,
        }),
      );
    }
    if (this._authConfigration.providers.includes('github')) {
      providers.push(
        GithubProvider({
          clientId: process.env.TACH_GITHUB_CLIENT_ID as string,
          clientSecret: (await this._secretsProvider.provide(
            'TACH_GITHUB_CLIENT_SECRET',
          ))!,
        }),
      );
    }
    if (this._authConfigration.providers.includes('azure-ad')) {
      providers.push(
        AzureADProvider({
          clientId: process.env.TACH_AZURE_AD_CLIENT_ID as string,
          clientSecret: (await this._secretsProvider.provide(
            'TACH_AZURE_AD_CLIENT_SECRET',
          ))!,
          tenantId: process.env.TACH_AZURE_AD_TENANT_ID as string,
        }),
      );
    }
    if (this._authConfigration.providers.includes('linkedin')) {
      providers.push(
        LinkedInProvider({
          clientId: process.env.TACH_LINKEDIN_CLIENT_ID as string,
          clientSecret: (await this._secretsProvider.provide(
            'TACH_LINKEDIN_CLIENT_SECRET',
          ))!,
        }),
      );
    }
    return providers;
  }

  private getCallbacks(
    req: NextApiRequest,
    res: NextApiResponse,
    session: SessionOptions,
    adapter: Adapter,
  ): Partial<CallbacksOptions<Profile, Account>> | undefined {
    return {
      async signIn({ user }) {
        if (
          req.query.nextauth?.includes('callback') &&
          req.query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          if (user && '_id' in user) {
            const sessionToken = randomUUID();
            const sessionExpiry = new Date(Date.now() + session.maxAge * 1000);
            adapter.createSession({
              sessionToken,
              userId: user._id!.toString(),
              expires: sessionExpiry,
            });
            const cookies = new Cookies(req, res, { secure: true });
            cookies.set('__Secure-next-auth.session-token', sessionToken, {
              expires: sessionExpiry,
              secure: true,
              httpOnly: true,
            });
            return true;
          }
        }
        if (user && 'id' in user) {
          return true;
        }
        return false;
      },
      async session({ session, user }: any) {
        if (session.user) {
          session.user = user as User;
          session.user._id = user.id;
        }
        return session;
      },
    };
  }
}

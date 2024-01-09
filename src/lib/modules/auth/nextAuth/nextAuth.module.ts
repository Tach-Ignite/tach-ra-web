import { ModuleClass, Module } from '@/lib/ioc/module';
import {
  IDatabaseClient,
  IFactory,
  IServiceResolver,
} from '@/lib/abstractions';
import { DatabaseQueryRepository } from '@/lib/repositories/databaseQueryRepository';
import { CredentialsProviderFactory } from '@/lib/auth/nextAuth/authProviders/credentialsProviderFactory';
import { NextAuthAdapterFactory } from '@/lib/auth/nextAuth/adapters/adapterFactory';
import { AuthOptionsFactory } from '@/lib/auth/nextAuth/authOptions/authOptionsFactory';
import { ServerIdentity } from '@/lib/auth/nextAuth/identity/serverIdentity';
import { SecretsModule } from '../../services/server/security/secrets.module';
import { DataProvidersModule } from '../../services/server/data/providers/dataProviders.module';
import { ConfigurationModule } from '../../config/configuration.module';

@Module
export class NextAuthModule extends ModuleClass {
  constructor() {
    super({
      imports: [ConfigurationModule, DataProvidersModule, SecretsModule],
      providers: [
        {
          provide: 'nextAuthUserRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseQueryRepository(databaseClientFactory, 'users');
          },
        },
        {
          provide: 'sessionRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseQueryRepository(
              databaseClientFactory,
              'sessions',
            );
          },
        },
        {
          provide: 'credentialsProviderFactory',
          useClass: CredentialsProviderFactory,
        },
        {
          provide: 'adapterFactory',
          useClass: NextAuthAdapterFactory,
        },
        {
          provide: 'authOptionsFactory',
          useClass: AuthOptionsFactory,
        },
        {
          provide: 'serverIdentity',
          useClass: ServerIdentity,
        },
      ],
    });
  }
}

import { ModuleClass, Module } from '@/lib/ioc/module';
import { DatabaseQueryRepository } from '@/lib/repositories';
import {
  AuthOptionsFactory,
  CredentialsProviderFactory,
  NextAuthAdapterFactory,
  ServerIdentity,
} from '@/lib/auth/nextAuth';
import {
  IDatabaseClient,
  IFactory,
  IServiceResolver,
} from '@/lib/abstractions';
import { ConfigurationModule } from '../../config/configuration.module';
import { DataProvidersModule } from '../../services/server/data/providers/dataProviders.module';
import { SecretsModule } from '../../services/server/security/secrets.module';

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

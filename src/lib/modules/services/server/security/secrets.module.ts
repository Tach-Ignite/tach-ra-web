import { Module, ModuleClass } from '@/lib/ioc/module';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { EnvSecretsProvider } from '@/lib/services/server/security/envSecretsProvider';
import { SecretsProviderFactory } from '@/lib/services/server/security/secretsProviderFactory';
import { SsmSecretsProvider } from '@/lib/services/server/security/ssmSecretsProvider';

@Module
export class SecretsModule extends ModuleClass {
  constructor() {
    super({
      imports: [ConfigurationModule],
      providers: [
        {
          provide: 'secretsProviderFactory',
          useClass: SecretsProviderFactory,
        },
        {
          provide: 'envSecretsProvider',
          useClass: EnvSecretsProvider,
        },
        {
          provide: 'ssmSecretsProvider',
          useClass: SsmSecretsProvider,
        },
      ],
    });
  }
}

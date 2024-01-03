import { Module, ModuleClass } from '@/lib/ioc';
import { RecaptchaValidator } from '@/lib/services/server';
import { FakeRecaptchaValidator } from '@/lib/services/server/security/fakeRecaptchaValidator';
import { RecaptchaValidatorFactory } from '@/lib/services/server/security/recaptchaValidatorFactory';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { SecretsModule } from './secrets.module';

@Module
export class RecaptchaModule extends ModuleClass {
  constructor() {
    super({
      imports: [SecretsModule, ConfigurationModule],
      providers: [
        {
          provide: 'recaptchaValidator',
          useClass: RecaptchaValidator,
        },
        {
          provide: 'fakeRecaptchaValidator',
          useClass: FakeRecaptchaValidator,
        },
        {
          provide: 'recaptchaValidatorFactory',
          useClass: RecaptchaValidatorFactory,
        },
      ],
    });
  }
}

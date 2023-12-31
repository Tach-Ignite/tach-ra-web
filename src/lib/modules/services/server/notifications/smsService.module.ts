import { Module, ModuleClass } from '@/lib/ioc/module';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { SnsSmsService } from '@/lib/services/server/notifications/snsSmsService';
import { FakeConsoleSmsService } from '@/lib/services/server/notifications/fakeConsoleSmsService';
import { SmsServiceFactory } from '@/lib/services/server/notifications/smsServiceFactory';
import { SecretsModule } from '../security/secrets.module';

@Module
export class SmsServiceModule extends ModuleClass {
  constructor() {
    super({
      imports: [SecretsModule, ConfigurationModule],
      providers: [
        {
          provide: 'snsSmsService',
          useClass: SnsSmsService,
        },
        {
          provide: 'fakeConsoleSmsService',
          useClass: FakeConsoleSmsService,
        },
        {
          provide: 'smsServiceFactory',
          useClass: SmsServiceFactory,
        },
      ],
    });
  }
}

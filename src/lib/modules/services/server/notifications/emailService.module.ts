import { Module, ModuleClass } from '@/lib/ioc/module';
import { SESEmailService } from '@/lib/services/server/notifications/SESEmailService';
import { FakeConsoleEmailService } from '@/lib/services/server/notifications/fakeConsoleEmailService';
import { EmailServiceFactory } from '@/lib/services/server/notifications/emailServiceFactory';
import { SecretsModule } from '../security/secrets.module';

@Module
export class EmailServiceModule extends ModuleClass {
  constructor() {
    const tachEmailSource = process.env.TACH_EMAIL_SOURCE ?? '';
    const nextPublicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
    const tachEmailContactAddress =
      process.env.TACH_EMAIL_CONTACT_ADDRESS ?? '';

    super({
      imports: [SecretsModule],
      providers: [
        {
          provide: 'tachEmailSource',
          useValue: tachEmailSource,
        },
        {
          provide: 'tachEmailContactAddress',
          useValue: tachEmailContactAddress,
        },
        {
          provide: 'nextPublicBaseUrl',
          useValue: nextPublicBaseUrl,
        },
        {
          provide: 'sesEmailService',
          useClass: SESEmailService,
        },
        {
          provide: 'fakeConsoleEmailService',
          useClass: FakeConsoleEmailService,
        },
        {
          provide: 'emailServiceFactory',
          useClass: EmailServiceFactory,
        },
      ],
    });
  }
}

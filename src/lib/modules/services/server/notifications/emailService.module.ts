import { ErrorWithStatusCode } from '@/lib/errors';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { SESEmailService } from '@/lib/services/server/notifications/SESEmailService';
import { SecretsModule } from '../security/secrets.module';

@Module
export class EmailServiceModule extends ModuleClass {
  constructor() {
    const tachEmailSource = process.env.TACH_EMAIL_SOURCE ?? '';
    const nextPublicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

    super({
      imports: [SecretsModule],
      providers: [
        {
          provide: 'tachEmailSource',
          useValue: tachEmailSource,
        },
        {
          provide: 'nextPublicBaseUrl',
          useValue: nextPublicBaseUrl,
        },
        {
          provide: 'emailService',
          useClass: SESEmailService,
        },
      ],
    });
  }
}

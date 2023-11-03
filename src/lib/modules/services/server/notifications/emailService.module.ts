import { ErrorWithStatusCode } from '@/lib/errors';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { SESEmailService } from '@/lib/services/server/notifications/SESEmailService';
import { SecretsModule } from '../security/secrets.module';

@Module
export class EmailServiceModule extends ModuleClass {
  constructor() {
    const tachEmailSource = process.env.TACH_EMAIL_SOURCE;
    if (!tachEmailSource) {
      throw new ErrorWithStatusCode(
        'TACH_EMAIL_SOURCE environment variable is not defined',
        500,
        'There was an error on the server. Please try again later.',
      );
    }

    const nextPublicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!nextPublicBaseUrl) {
      throw new ErrorWithStatusCode(
        'NEXT_PUBLIC_BASE_URL environment variable is not defined',
        500,
        'There was an error on the server. Please try again later.',
      );
    }

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

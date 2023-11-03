import {
  IDatabaseClient,
  IFactory,
  IServiceResolver,
} from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { EmailServiceModule } from '@/lib/modules/services/server/notifications/emailService.module';
import { DatabaseCommandRepository } from '@/lib/repositories';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { ContactService } from '@/services/contact';

@Module
export class ContactServiceModule extends ModuleClass {
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
      imports: [AutomapperModule, EmailServiceModule],
      providers: [
        {
          provide: 'contactRequestCommandRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseCommandRepository(
              databaseClientFactory,
              'contactRequests',
            );
          },
        },
        {
          provide: 'contactService',
          useClass: ContactService,
        },
      ],
    });
  }
}

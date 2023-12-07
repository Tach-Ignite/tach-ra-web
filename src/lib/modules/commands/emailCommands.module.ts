import { Module, ModuleClass } from '@/lib/ioc/module';
import { SendEmailCommand } from '@/lib/commands/implementations/notifications';
import { EmailServiceModule } from '../services/server/notifications/emailService.module';

@Module
export class EmailCommandsModule extends ModuleClass {
  constructor() {
    super({
      imports: [EmailServiceModule],
      providers: [
        {
          provide: 'sendEmailCommand',
          useClass: SendEmailCommand,
        },
      ],
    });
  }
}

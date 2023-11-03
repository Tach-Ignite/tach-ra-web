import { CreateContactRequestCommand } from '@/commands/contact';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { ContactServiceModule } from '@/modules/services/contact/contactService.module';

@Module
export class ContactCommandsModule extends ModuleClass {
  constructor() {
    super({
      imports: [ContactServiceModule],
      providers: [
        {
          provide: 'createContactRequestCommand',
          useClass: CreateContactRequestCommand,
        },
      ],
    });
  }
}

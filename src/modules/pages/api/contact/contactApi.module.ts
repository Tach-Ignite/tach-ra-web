import { ValidateRecaptchaTokenCommand } from '@/lib/commands/implementations/security';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { CommandsModule } from '@/lib/modules/commands/commands.module';
import { RecaptchaModule } from '@/lib/modules/services/server/security/recaptcha.module';
import { ContactCommandsModule } from '@/modules/commands/contact/contactCommands.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';

@Module
export class ContactApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        ApiModule,
        CommandsModule,
        AutomapperModule,
        ContactCommandsModule,
        RecaptchaModule,
      ],
      providers: [
        {
          provide: 'validateRecaptchaTokenCommand',
          useClass: ValidateRecaptchaTokenCommand,
        },
      ],
    });
  }
}

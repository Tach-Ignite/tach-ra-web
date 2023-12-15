import { ValidateRecaptchaTokenCommand } from '@/lib/commands/implementations/security';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { CommandsModule } from '@/lib/modules/commands/commands.module';
import { RecaptchaModule } from '@/lib/modules/services/server/security/recaptcha.module';
import { InterestListCommandsModule } from '@/modules/commands/interestLists/interestListCommands.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { InterestListServiceModule } from '@/modules/services/interestLists/interestListService.module';

@Module
export class InterestListsApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        ApiModule,
        AutomapperModule,
        CommandsModule,
        InterestListServiceModule,
        NextAuthModule,
        InterestListCommandsModule,
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

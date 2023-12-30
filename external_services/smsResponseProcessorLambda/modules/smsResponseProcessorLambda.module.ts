import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { CommandsModule } from '@/lib/modules/commands/commands.module';
import { SmsServiceModule } from '@/lib/modules/services/server/notifications/smsService.module';
import { UserServiceModule } from '@/modules/services/users/userService.module';

@Module
export class SmsResponseProcessorLambdaModule extends ModuleClass {
  constructor() {
    super({
      imports: [SmsServiceModule, UserServiceModule],
      providers: [],
    });
  }
}

import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { CommandsModule } from '@/lib/modules/commands/commands.module';
import { UserCommandsModule } from '@/modules/commands/users/userCommands.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { UserServiceModule } from '@/modules/services/users/userService.module';

@Module
export class UsersApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        ApiModule,
        NextAuthModule,
        UserServiceModule,
        AutomapperModule,
        CommandsModule,
        UserCommandsModule,
      ],
      providers: [],
    });
  }
}

import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { CommandsModule } from '@/lib/modules/commands/commands.module';
import { UserAddressCommandsModule } from '@/modules/commands/userAddresses/userAddressCommands.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { UserAddressServiceModule } from '@/modules/services/userAddresses/userAddressService.module';

@Module
export class CurrentUserAddressesApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        ApiModule,
        NextAuthModule,
        AutomapperModule,
        UserAddressServiceModule,
        CommandsModule,
        UserAddressCommandsModule,
      ],
      providers: [],
    });
  }
}

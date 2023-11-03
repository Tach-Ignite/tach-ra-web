import { Module, ModuleClass } from '@/lib/ioc/module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { UserServiceModule } from '@/modules/services/users/userService.module';

@Module
export class AdminUsersModule extends ModuleClass {
  constructor() {
    super({
      imports: [NextAuthModule, UserServiceModule, AutomapperModule],
      providers: [],
    });
  }
}

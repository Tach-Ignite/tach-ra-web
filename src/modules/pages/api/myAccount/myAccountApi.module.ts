import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { OrderServiceModule } from '@/modules/services/orders/orderService.module';
import { UserServiceModule } from '@/modules/services/users/userService.module';

@Module
export class MyAccountApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        ApiModule,
        NextAuthModule,
        UserServiceModule,
        OrderServiceModule,
        AutomapperModule,
      ],
      providers: [],
    });
  }
}

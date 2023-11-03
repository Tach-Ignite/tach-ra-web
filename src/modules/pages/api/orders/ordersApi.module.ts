import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { CommandsModule } from '@/lib/modules/commands/commands.module';
import { OrderCommandsModule } from '@/modules/commands/orders/orderCommands.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { OrderServiceModule } from '@/modules/services/orders/orderService.module';

@Module
export class OrdersApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        ApiModule,
        NextAuthModule,
        CommandsModule,
        AutomapperModule,
        OrderServiceModule,
        OrderCommandsModule,
      ],
      providers: [],
    });
  }
}

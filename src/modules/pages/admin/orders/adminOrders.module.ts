import { Module, ModuleClass } from '@/lib/ioc/module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { OrderServiceModule } from '@/modules/services/orders/orderService.module';

@Module
export class AdminOrdersModule extends ModuleClass {
  constructor() {
    super({
      imports: [OrderServiceModule, NextAuthModule, AutomapperModule],
      providers: [],
    });
  }
}

import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { CartServiceModule } from '@/modules/services/cart/cartService.module';

@Module
export class MyAccountCartApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [ApiModule, NextAuthModule, CartServiceModule, AutomapperModule],
      providers: [],
    });
  }
}

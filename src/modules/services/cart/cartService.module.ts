import { Module, ModuleClass } from '@/lib/ioc/module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { CartService } from '@/services/carts/cartService';
import { CartRepositoriesModule } from '@/modules/repositories/cart/cartRepositories.module';
import { ProductServiceModule } from '../products/productService.module';

@Module
export class CartServiceModule extends ModuleClass {
  constructor() {
    super({
      imports: [AutomapperModule, CartRepositoriesModule, ProductServiceModule],
      providers: [
        {
          provide: 'cartService',
          useClass: CartService,
        },
      ],
    });
  }
}

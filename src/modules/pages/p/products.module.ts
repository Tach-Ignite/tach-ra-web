import { Module, ModuleClass } from '@/lib/ioc/module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { ProductServiceModule } from '@/modules/services/products/productService.module';

@Module
export class ProductsModule extends ModuleClass {
  constructor() {
    super({
      imports: [ProductServiceModule, AutomapperModule],
      providers: [],
    });
  }
}

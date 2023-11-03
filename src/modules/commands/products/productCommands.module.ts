import {
  CreateProductCommand,
  DeleteProductCommand,
  EditProductCommand,
} from '@/commands/products';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { IdOmitter } from '@/lib/services/server/models/idOmitter';
import { ProductServiceModule } from '@/modules/services/products/productService.module';

@Module
export class ProductCommandsModule extends ModuleClass {
  constructor() {
    super({
      imports: [ProductServiceModule],
      providers: [
        {
          provide: 'idOmitter',
          useClass: IdOmitter,
        },
        {
          provide: 'createProductCommand',
          useClass: CreateProductCommand,
        },
        {
          provide: 'deleteProductCommand',
          useClass: DeleteProductCommand,
        },
        {
          provide: 'editProductCommand',
          useClass: EditProductCommand,
        },
      ],
    });
  }
}

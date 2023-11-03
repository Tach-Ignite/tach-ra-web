import { Module, ModuleClass } from '@/lib/ioc/module';
import { ProductRepositoriesModule } from '@/modules/repositories/products/productRepositories.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { FileStorageServiceModule } from '@/lib/modules/services/server/fileStorage/fileStorageService.module';
import { LoggingModule } from '@/lib/modules/logging/logging.module';
import { Validator } from '@/lib/services/server/models/validator';
import { ProductService } from '@/services/products';
import Ajv from 'ajv';
import { customFormats } from '@/lib/utils';
import { CategoryServiceModule } from '../categories/categoryService.module';

@Module
export class ProductServiceModule extends ModuleClass {
  private _ajv: Ajv;

  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      $data: true,
      formats: customFormats,
    });

    super({
      imports: [
        ProductRepositoriesModule,
        CategoryServiceModule,
        AutomapperModule,
        FileStorageServiceModule,
        LoggingModule,
      ],
      providers: [
        {
          provide: 'ajv',
          useValue: ajv,
        },
        {
          provide: 'validator',
          useValue: Validator,
        },
        {
          provide: 'productService',
          useClass: ProductService,
        },
      ],
    });

    this._ajv = ajv;
  }
}

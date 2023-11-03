import { Module, ModuleClass } from '@/lib/ioc/module';
import { Validator } from '@/lib/services/server/models/validator';
import Ajv from 'ajv';
import { customFormats } from '@/lib/utils';
import { CategoryRepositoriesModule } from '@/modules/repositories/categories/categoryRepositories.module';
import { ProductRepositoriesModule } from '@/modules/repositories/products/productRepositories.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { CategoryService } from '@/services/categories';

@Module
export class CategoryServiceModule extends ModuleClass {
  private _ajv: Ajv;

  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      $data: true,
      formats: customFormats,
    });

    super({
      imports: [
        CategoryRepositoriesModule,
        ProductRepositoriesModule,
        AutomapperModule,
      ],
      providers: [
        {
          provide: 'ajv',
          useValue: ajv,
        },
        {
          provide: 'validator',
          useClass: Validator,
        },
        {
          provide: 'categoryService',
          useClass: CategoryService,
        },
      ],
    });

    this._ajv = ajv;
  }
}

import {
  AddCategoryCommand,
  DeleteCategoryCommand,
  EditCategoryCommand,
} from '@/commands/categories';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { CategoryServiceModule } from '@/modules/services/categories/categoryService.module';

@Module
export class CategoryCommandsModule extends ModuleClass {
  constructor() {
    super({
      imports: [CategoryServiceModule],
      providers: [
        {
          provide: 'addCategoryCommand',
          useClass: AddCategoryCommand,
        },
        {
          provide: 'deleteCategoryCommand',
          useClass: DeleteCategoryCommand,
        },
        {
          provide: 'editCategoryCommand',
          useClass: EditCategoryCommand,
        },
      ],
    });
  }
}

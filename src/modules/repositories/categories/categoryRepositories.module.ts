import { Module, ModuleClass } from '@/lib/ioc/module';
import { DataProvidersModule } from '@/lib/modules/services/server/data/providers/dataProviders.module';
import {
  CategoryCommandDatabaseRepository,
  CategoryQueryDatabaseRepository,
} from '@/repositories/categories';

@Module
export class CategoryRepositoriesModule extends ModuleClass {
  constructor() {
    super({
      imports: [DataProvidersModule],
      providers: [
        {
          provide: 'categoryQueryRepository',
          useClass: CategoryQueryDatabaseRepository,
        },
        {
          provide: 'categoryCommandRepository',
          useClass: CategoryCommandDatabaseRepository,
        },
      ],
    });
  }
}

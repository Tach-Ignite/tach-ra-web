import {
  IDatabaseClient,
  IFactory,
  IServiceResolver,
} from '@/lib/abstractions';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { DataProvidersModule } from '@/lib/modules/services/server/data/providers/dataProviders.module';
import { DatabaseQueryRepository } from '@/lib/repositories';
import { ProductCommandDatabaseRepository } from '@/repositories/products';

@Module
export class ProductRepositoriesModule extends ModuleClass {
  constructor() {
    super({
      imports: [DataProvidersModule],
      providers: [
        {
          provide: 'productQueryRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseQueryRepository(
              databaseClientFactory,
              'products',
            );
          },
        },
        {
          provide: 'productCommandRepository',
          useClass: ProductCommandDatabaseRepository,
        },
      ],
    });
  }
}

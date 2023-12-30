import {
  IDatabaseClient,
  IFactory,
  IServiceResolver,
} from '@/lib/abstractions';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { DataProvidersModule } from '@/lib/modules/services/server/data/providers/dataProviders.module';
import {
  DatabaseCommandRepository,
  DatabaseQueryRepository,
} from '@/lib/repositories';
import { CartQueryDatabaseRepository } from '@/repositories/carts/cartQueryRepository';

@Module
export class CartRepositoriesModule extends ModuleClass {
  constructor() {
    super({
      imports: [DataProvidersModule],
      providers: [
        {
          provide: 'userCommandRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseCommandRepository(
              databaseClientFactory,
              'users',
            );
          },
        },
        {
          provide: 'cartQueryRepository',
          useClass: CartQueryDatabaseRepository,
        },
      ],
    });
  }
}

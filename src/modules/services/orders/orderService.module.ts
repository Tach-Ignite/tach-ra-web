import { Module, ModuleClass } from '@/lib/ioc/module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { OrderService } from '@/services/orders';
import {
  IDatabaseClient,
  IFactory,
  IServiceResolver,
} from '@/lib/abstractions';
import { DatabaseQueryRepository } from '@/lib/repositories/databaseQueryRepository';
import { DatabaseCommandRepository } from '@/lib/repositories/databaseCommandRepository';
import { UserAddressServiceModule } from '../userAddresses/userAddressService.module';

@Module
export class OrderServiceModule extends ModuleClass {
  constructor() {
    super({
      imports: [AutomapperModule, UserAddressServiceModule],
      providers: [
        {
          provide: 'orderQueryRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseQueryRepository(databaseClientFactory, 'orders');
          },
        },
        {
          provide: 'orderCommandRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseCommandRepository(
              databaseClientFactory,
              'orders',
            );
          },
        },
        {
          provide: 'userQueryRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseQueryRepository(databaseClientFactory, 'users');
          },
        },
        {
          provide: 'orderService',
          useClass: OrderService,
        },
      ],
    });
  }
}

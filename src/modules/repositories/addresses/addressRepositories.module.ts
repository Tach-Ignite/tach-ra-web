import {
  IDatabaseClient,
  IFactory,
  IServiceResolver,
} from '@/lib/abstractions';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { DataProvidersModule } from '@/lib/modules/services/server/data/providers/dataProviders.module';
import { DatabaseCommandRepository } from '@/lib/repositories';
import { IdOmitter } from '@/lib/services/server/models/idOmitter';
import { AddressDatabaseQueryRepository } from '@/repositories/addresses';

@Module
export class AddressRepositoriesModule extends ModuleClass {
  constructor() {
    super({
      imports: [DataProvidersModule],
      providers: [
        {
          provide: 'idOmitter',
          useClass: IdOmitter,
        },
        {
          provide: 'addressQueryRepository',
          useClass: AddressDatabaseQueryRepository,
        },
        {
          provide: 'addressCommandRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseCommandRepository(
              databaseClientFactory,
              'addresses',
            );
          },
        },
      ],
    });
  }
}

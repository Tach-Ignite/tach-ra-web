import { Module, ModuleClass } from '@/lib/ioc/module';
import { DataProvidersModule } from '@/lib/modules/services/server/data/providers/dataProviders.module';
import {
  UserAddressDatabaseCommandRepository,
  UserAddressDatabaseQueryRepository,
} from '@/repositories/userAddresses';

@Module
export class UserAddressRepositoriesModule extends ModuleClass {
  constructor() {
    super({
      imports: [DataProvidersModule],
      providers: [
        {
          provide: 'userAddressQueryRepository',
          useClass: UserAddressDatabaseQueryRepository,
        },
        {
          provide: 'userAddressCommandRepository',
          useClass: UserAddressDatabaseCommandRepository,
        },
      ],
    });
  }
}

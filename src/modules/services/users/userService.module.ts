import { Module, ModuleClass } from '@/lib/ioc/module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { EmailServiceModule } from '@/lib/modules/services/server/notifications/emailService.module';
import { IdOmitter } from '@/lib/services/server/models/idOmitter';
import { UserService } from '@/services/users';
import { DataProvidersModule } from '@/lib/modules/services/server/data/providers/dataProviders.module';
import {
  IDatabaseClient,
  IFactory,
  IServiceResolver,
} from '@/lib/abstractions';
import { TokenServiceModule } from '@/lib/modules/services/server/security/tokenService.module';
import { DatabaseQueryRepository } from '@/lib/repositories/databaseQueryRepository';
import { DatabaseCommandRepository } from '@/lib/repositories/databaseCommandRepository';
import { UserAddressServiceModule } from '../userAddresses/userAddressService.module';
import { ProductServiceModule } from '../products/productService.module';

@Module
export class UserServiceModule extends ModuleClass {
  constructor() {
    super({
      imports: [
        UserAddressServiceModule,
        ProductServiceModule,
        AutomapperModule,
        EmailServiceModule,
        DataProvidersModule,
        TokenServiceModule,
      ],
      providers: [
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
          provide: 'accountQueryRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseQueryRepository(
              databaseClientFactory,
              'accounts',
            );
          },
        },
        {
          provide: 'accountCommandRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<
              IFactory<Promise<IDatabaseClient>>
            >('databaseClientFactory');
            return new DatabaseCommandRepository(
              databaseClientFactory,
              'accounts',
            );
          },
        },
        {
          provide: 'idOmitter',
          useClass: IdOmitter,
        },
        {
          provide: 'userService',
          useClass: UserService,
        },
      ],
    });
  }
}

import { Module, ModuleClass } from '@/lib/ioc/module';
import { MongoDataApiClient } from '@/lib/services/server/data/providers/mongodb/mongoDataApiClient';
import { MongoClientFactory } from '@/lib/services/server/data/providers/mongodb/mongoClientFactory';
import { MongoDatabaseClient } from '@/lib/services/server/data/providers/mongodb/mongoDatabaseClient';
import { SecretsModule } from '../../../security/secrets.module';

@Module
export class MongoDbDataProviderModule extends ModuleClass {
  constructor() {
    super({
      imports: [SecretsModule],
      providers: [
        {
          provide: 'connectionMethodology',
          useValue: 'factory',
        },
        {
          provide: 'mongoClientFactory',
          useClass: MongoClientFactory,
        },
        {
          provide: 'mongoDataApiClient',
          useClass: MongoDataApiClient,
        },
        {
          provide: 'mongoDatabaseClient',
          useClass: MongoDatabaseClient,
        },
      ],
    });
  }
}

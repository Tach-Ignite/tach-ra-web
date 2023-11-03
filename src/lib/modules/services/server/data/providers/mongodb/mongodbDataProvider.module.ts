import { Module, ModuleClass } from '@/lib/ioc/module';
import {
  MongoClientFactory,
  MongoDatabaseClient,
} from '@/lib/services/server/data/providers/mongodb';
import { SecretsModule } from '../../../security/secrets.module';

@Module
export class MongoDbDataProviderModule extends ModuleClass {
  constructor() {
    super({
      imports: [SecretsModule],
      providers: [
        {
          provide: 'mongoClientFactory',
          useClass: MongoClientFactory,
        },
        {
          provide: 'mongoDatabaseClient',
          useClass: MongoDatabaseClient,
        },
      ],
    });
  }
}

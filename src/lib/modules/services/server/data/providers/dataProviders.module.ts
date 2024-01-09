import { Module, ModuleClass } from '@/lib/ioc/module';
import { DatabaseClientFactory } from '@/lib/services/server/data/providers/databaseClientFactory';
import { ConfigurationModule } from '../../../../config/configuration.module';
import { MongoDbDataProviderModule } from './mongodb/mongodbDataProvider.module';

@Module
export class DataProvidersModule extends ModuleClass {
  constructor() {
    super({
      imports: [ConfigurationModule, MongoDbDataProviderModule],
      providers: [
        {
          provide: 'databaseClientFactory',
          useClass: DatabaseClientFactory,
        },
      ],
    });
  }
}

import { Module, ModuleClass } from '@/lib/ioc/module';
import {
  IConfigurationFactory,
  IServiceResolver,
  ISeedConfiguration,
  ISeedDataConfiguration,
  ISeedFilesConfiguration,
} from '@/lib/abstractions';
import { SecretsModule } from '@/lib/modules/services/server/security/secrets.module';
import { MongoDbDataProviderModule } from '@/lib/modules/services/server/data/providers/mongodb/mongodbDataProvider.module';
import { LoggingModule } from '@/lib/modules/logging/logging.module';
import { ConfigurationFactory } from '@/lib/config/configurationFactory';
import { Options } from '@/lib/config/options';
import { S3FileStorageService } from '@/lib/services/server/fileStorage/s3FileStorageService';
import { DummyFileStorageService } from '@/lib/services/server/fileStorage/dummyFileStorageService';
import { MongodbFileStorageService } from '@/lib/services/server/fileStorage/mongodbFileStorageService';
import { ImageStorageService } from '@/lib/services/server/fileStorage/imageStorageService/imageStorageService';
import { SeederDatabaseClientFactory } from './seederDatabaseClientFactory';
import { SeederFileStorageServiceFactory } from './seederFileStorageServiceFactory';
import { getTachConfig } from '../../getTachConfig';
import { Seeder } from './seeder';
import { DataLoader } from './dataLoader';

@Module
class SeederModule extends ModuleClass {
  constructor() {
    super({
      imports: [SecretsModule, MongoDbDataProviderModule, LoggingModule],
      providers: [
        {
          provide: 'configFile',
          useValue: getTachConfig(),
        },
        {
          provide: 'configurationFactory',
          useClass: ConfigurationFactory,
        },
        {
          provide: 'seedConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const seedSection =
              config.getSection<ISeedConfiguration>('storage.seed');
            if (!seedSection) {
              return null;
            }
            return new Options(seedSection);
          },
        },
        {
          provide: 'seedDataConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const seedSection =
              config.getSection<ISeedDataConfiguration>('storage.seed.data');
            if (!seedSection) {
              return null;
            }
            return new Options(seedSection);
          },
        },
        {
          provide: 'seedFilesConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const seedSection =
              config.getSection<ISeedFilesConfiguration>('storage.seed.files');
            if (!seedSection) {
              return null;
            }
            return new Options(seedSection);
          },
        },
        {
          provide: 's3FileStorageService',
          useClass: S3FileStorageService,
        },
        {
          provide: 'dummyFileStorageService',
          useClass: DummyFileStorageService,
        },
        {
          provide: 'mongodbFileStorageService',
          useClass: MongodbFileStorageService,
        },
        {
          provide: 'fileStorageServiceFactory',
          useClass: SeederFileStorageServiceFactory,
        },
        {
          provide: 'imageStorageService',
          useClass: ImageStorageService,
        },
        {
          provide: 'databaseClientFactory',
          useClass: SeederDatabaseClientFactory,
        },
        {
          provide: 'dataLoader',
          useClass: DataLoader,
        },
        {
          provide: 'connectionMethodology',
          useValue: 'factory',
        },
        {
          provide: 'seeder',
          useClass: Seeder,
        },
      ],
    });
  }
}

export { SeederModule };

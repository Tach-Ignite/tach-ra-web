import { Module, ModuleClass } from '@/lib/ioc/module';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { LoggingModule } from '@/lib/modules/logging/logging.module';
import { MongoClientFactory } from '@/lib/services/server/data/providers/mongodb';
import {
  DummyFileStorageService,
  FileStorageServiceFactory,
  ImageStorageService,
  MongodbFileStorageService,
  S3FileStorageService,
} from '@/lib/services/server/fileStorage';
import { SecretsModule } from '../security/secrets.module';

@Module
export class FileStorageServiceModule extends ModuleClass {
  constructor() {
    super({
      imports: [ConfigurationModule, LoggingModule, SecretsModule],
      providers: [
        // {
        //   provide: 'mongoClientFactory',
        //   useClass: MongoClientFactory,
        // },
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
          useClass: FileStorageServiceFactory,
        },
        {
          provide: 'imageStorageService',
          useClass: ImageStorageService,
        },
      ],
    });
  }
}

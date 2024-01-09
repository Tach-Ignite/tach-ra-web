import { Module, ModuleClass } from '@/lib/ioc/module';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { LoggingModule } from '@/lib/modules/logging/logging.module';
import { S3FileStorageService } from '@/lib/services/server/fileStorage/s3FileStorageService';
import { DummyFileStorageService } from '@/lib/services/server/fileStorage/dummyFileStorageService';
import { MongodbFileStorageService } from '@/lib/services/server/fileStorage/mongodbFileStorageService';
import { FileStorageServiceFactory } from '@/lib/services/server/fileStorage/fileStorageServiceFactory';
import { ImageStorageService } from '@/lib/services/server/fileStorage/imageStorageService/imageStorageService';
import { MongoClientFactory } from '@/lib/services/server/data/providers/mongodb/mongoClientFactory';
import { SecretsModule } from '../security/secrets.module';

@Module
export class FileStorageServiceModule extends ModuleClass {
  constructor() {
    super({
      imports: [ConfigurationModule, LoggingModule, SecretsModule],
      providers: [
        {
          provide: 'mongoClientFactory',
          useClass: MongoClientFactory,
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

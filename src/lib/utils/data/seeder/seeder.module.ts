import { Module, ModuleClass } from '@/lib/ioc/module';
import { DataProvidersModule } from '@/lib/modules/services/server/data/providers/dataProviders.module';
import { FileStorageServiceModule } from '@/lib/modules/services/server/fileStorage/fileStorageService.module';
import { ConfigurationFactory, Options } from '@/lib/config';
import { IConfigurationFactory, IServiceResolver } from '@/lib/abstractions';
import tc from 'tach.config';
import { DataLoader } from './dataLoader';
import { Seeder } from './seeder';
import { ISeedConfiguration } from './abstractions';
// @ts-ignore
let tcLocal = require('tach.config.local');

if (!tcLocal) tcLocal = {};

@Module
class SeederModule extends ModuleClass {
  constructor() {
    super({
      imports: [DataProvidersModule, FileStorageServiceModule],
      providers: [
        {
          provide: 'configFile',
          useValue: Object.keys(tcLocal).length === 0 ? tc : tcLocal,
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
          provide: 'dataLoader',
          useClass: DataLoader,
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

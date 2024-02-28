import { Module, ModuleClass } from '@/lib/ioc';
import { getTachConfig } from '../getTachConfig';
import { ConfigurationFactory } from '@/lib/config/configurationFactory';
import { IConfigurationFactory, IServiceResolver } from '@/lib/abstractions';
import { Options } from '@/lib/config/options';
import { Configurator } from './configurator';

@Module
export class ConfigureModule extends ModuleClass {
  constructor() {
    super({
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
          provide: 'tachConfigurationOptions',
          useFactory: (serviceResolver: IServiceResolver) => {
            const factory = serviceResolver.resolve<IConfigurationFactory>(
              'configurationFactory',
            );
            const configFile = serviceResolver.resolve<any>('configFile');
            const config = factory.create(configFile);
            const tachSection = config.getConfig();
            if (!tachSection) return null;
            return new Options(tachSection);
          },
        },
        {
          provide: 'configurator',
          useClass: Configurator,
        },
      ],
    });
  }
}

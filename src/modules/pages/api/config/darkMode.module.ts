import { Module, ModuleClass } from '@/lib/ioc';
import { ConfigurationModule } from '@/lib/modules/config/configuration.module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';

@Module
export class ConfigDarkModeApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [ConfigurationModule, AutomapperModule],
      providers: [],
    });
  }
}

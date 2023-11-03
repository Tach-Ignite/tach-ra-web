import { Module, ModuleClass } from '@/lib/ioc/module';
import { MappingProfileRegistry } from '@/lib/mapping/automapperTypescript/mappingProfileRegistry';
import { DataProvidersModule } from '@/lib/modules/services/server/data/providers/dataProviders.module';
import { AutomapperFactory, AutomapperProvider } from '@/mapping/automapper';

@Module
export class AutomapperModule extends ModuleClass {
  constructor() {
    super({
      imports: [DataProvidersModule],
      providers: [
        {
          provide: 'mappingProfileRegistry',
          useClass: MappingProfileRegistry,
        },
        {
          provide: 'automapperFactory',
          useClass: AutomapperFactory,
        },
        {
          provide: 'automapperProvider',
          useClass: AutomapperProvider,
        },
      ],
    });
  }
}

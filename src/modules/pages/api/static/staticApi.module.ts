import { Module, ModuleClass } from '@/lib/ioc/module';
import { ApiModule } from '@/lib/modules/api/api.module';
import { FileStorageServiceModule } from '@/lib/modules/services/server/fileStorage/fileStorageService.module';

@Module
export class StaticApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [ApiModule, FileStorageServiceModule],
      providers: [],
    });
  }
}

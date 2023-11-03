import { EnumFactory } from '@/lib/enums';
import { Module, ModuleClass } from '@/lib/ioc/module';

@Module
export class EnumsModule extends ModuleClass {
  constructor() {
    super({
      providers: [
        {
          provide: 'enumFactory',
          useClass: EnumFactory,
        },
      ],
    });
  }
}

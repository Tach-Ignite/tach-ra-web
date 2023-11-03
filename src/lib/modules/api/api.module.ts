import { Module, ModuleClass } from '@/lib/ioc/module';
import Ajv from 'ajv';
import { customFormats } from '@/lib/utils';
import { LoggingModule } from '../logging/logging.module';

@Module
export class ApiModule extends ModuleClass {
  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      $data: true,
      formats: customFormats,
    });

    super({
      imports: [LoggingModule],
      providers: [],
    });
  }
}

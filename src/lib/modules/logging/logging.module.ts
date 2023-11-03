import { Module, ModuleClass } from '@/lib/ioc/module';
import { LoggerFactory } from '@/lib/logging';
import { ConfigurationModule } from '../config/configuration.module';

@Module
export class LoggingModule extends ModuleClass {
  constructor() {
    super({
      imports: [ConfigurationModule],
      providers: [
        {
          provide: 'loggerFactory',
          useClass: LoggerFactory,
        },
      ],
    });
  }
}

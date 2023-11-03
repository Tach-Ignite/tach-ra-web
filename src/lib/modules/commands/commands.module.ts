import { CommandFactory, Invoker } from '@/lib/commands';
import { Module, ModuleClass } from '@/lib/ioc/module';

@Module
export class CommandsModule extends ModuleClass {
  constructor() {
    super({
      providers: [
        {
          provide: 'commandFactory',
          useClass: CommandFactory,
        },
        {
          provide: 'invoker',
          useClass: Invoker,
        },
      ],
    });
  }
}

import { CreateInterestListCommand } from '@/commands/interestLists/createInterestListCommand';
import { CreateInterestListItemCommand } from '@/commands/interestLists/createInterestListItemCommand';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { InterestListServiceModule } from '@/modules/services/interestLists/interestListService.module';

@Module
export class InterestListCommandsModule extends ModuleClass {
  constructor() {
    super({
      imports: [InterestListServiceModule],
      providers: [
        {
          provide: 'createInterestListCommand',
          useClass: CreateInterestListCommand,
        },
        {
          provide: 'createInterestListItemCommand',
          useClass: CreateInterestListItemCommand,
        },
      ],
    });
  }
}

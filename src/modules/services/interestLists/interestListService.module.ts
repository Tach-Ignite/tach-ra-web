import { Module, ModuleClass } from '@/lib/ioc/module';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { Validator } from '@/lib/services/server/models/validator';
import Ajv from 'ajv';
import { customFormats } from '@/lib/utils';
import { InterestListRepositoriesModule } from '@/modules/repositories/interestLists/interestListRepositories.module';
import { InterestListService } from '@/services/interestLists/interestListService';

@Module
export class InterestListServiceModule extends ModuleClass {
  // private _ajv: Ajv;

  constructor() {
    // const ajv = new Ajv({
    //   allErrors: true,
    //   $data: true,
    //   formats: customFormats,
    // });

    super({
      imports: [InterestListRepositoriesModule, AutomapperModule],
      providers: [
        // {
        //   provide: 'ajv',
        //   useValue: ajv,
        // },
        // {
        //   provide: 'validator',
        //   useValue: Validator,
        // },
        {
          provide: 'interestListService',
          useClass: InterestListService,
        },
      ],
    });

    // this._ajv = ajv;
  }
}

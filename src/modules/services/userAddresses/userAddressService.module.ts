import { Module, ModuleClass } from '@/lib/ioc/module';
import { Validator } from '@/lib/services/server/models/validator';
import { customFormats } from '@/lib/utils';
import { AutomapperModule } from '@/modules/mapping/automapper/automapper.module';
import { AddressRepositoriesModule } from '@/modules/repositories/addresses/addressRepositories.module';
import { UserAddressRepositoriesModule } from '@/modules/repositories/userAddresses/userAddressRepositories.module';
import { UserAddressService } from '@/services/userAddresses';
import Ajv from 'ajv';

@Module
export class UserAddressServiceModule extends ModuleClass {
  private _ajv: Ajv;

  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      $data: true,
      formats: customFormats,
    });

    super({
      imports: [
        AddressRepositoriesModule,
        UserAddressRepositoriesModule,
        AutomapperModule,
      ],
      providers: [
        {
          provide: 'ajv',
          useValue: ajv,
        },
        {
          provide: 'validator',
          useClass: Validator,
        },
        {
          provide: 'userAddressService',
          useClass: UserAddressService,
        },
      ],
    });

    this._ajv = ajv;
  }
}

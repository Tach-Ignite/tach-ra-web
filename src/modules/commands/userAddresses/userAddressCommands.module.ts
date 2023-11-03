import {
  AddUserAddressCommand,
  DeleteUserAddressCommand,
  EditUserAddressCommand,
} from '@/commands/userAddresses';
import { Module, ModuleClass } from '@/lib/ioc/module';
import { IdOmitter } from '@/lib/services/server/models/idOmitter';

@Module
export class UserAddressCommandsModule extends ModuleClass {
  constructor() {
    super({
      providers: [
        {
          provide: 'idOmitter',
          useClass: IdOmitter,
        },
        {
          provide: 'addUserAddressCommand',
          useClass: AddUserAddressCommand,
        },
        {
          provide: 'deleteUserAddressCommand',
          useClass: DeleteUserAddressCommand,
        },
        {
          provide: 'editUserAddressCommand',
          useClass: EditUserAddressCommand,
        },
      ],
    });
  }
}

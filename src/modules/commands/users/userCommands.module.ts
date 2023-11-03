import {
  CreateUserCommand,
  ResendEmailAddressVerificationCommand,
  ResetPasswordCommand,
  SendPasswordResetRequestCommand,
  SetUserRolesCommand,
  VerifyEmailAddressCommand,
} from '@/commands/users';
import { Module, ModuleClass } from '@/lib/ioc/module';

@Module
export class UserCommandsModule extends ModuleClass {
  constructor() {
    super({
      providers: [
        {
          provide: 'createUserCommand',
          useClass: CreateUserCommand,
        },
        {
          provide: 'resendEmailAddressVerificationCommand',
          useClass: ResendEmailAddressVerificationCommand,
        },
        {
          provide: 'resetPasswordCommand',
          useClass: ResetPasswordCommand,
        },
        {
          provide: 'sendPasswordResetRequestCommand',
          useClass: SendPasswordResetRequestCommand,
        },
        {
          provide: 'setUserRolesCommand',
          useClass: SetUserRolesCommand,
        },
        {
          provide: 'verifyEmailAddressCommand',
          useClass: VerifyEmailAddressCommand,
        },
      ],
    });
  }
}

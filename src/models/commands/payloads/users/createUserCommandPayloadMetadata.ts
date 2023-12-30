import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { CreateUserCommandPayload } from './createUserCommandPayload';
import { VerifyEmailAddressCommandPayload } from './verifyEmailAddressCommandPayload';
import { SendPasswordResetRequestCommandPayload } from './sendPasswordResetRequestCommandPayload';
import { ResetPasswordCommandPayload } from './resetPasswordCommandPayload';
import { ResendEmailAddressVerificationCommandPayload } from './resendEmailAddressVerificationCommandPayload';
import { SetUserRolesCommandPayload } from './setUserRolesCommandPayload';
import { SetUserProfileCommandPayload } from './setUserProfileCommandPayload';

export function createUserCommandPayloadMetadata() {
  PojosMetadataMap.create<CreateUserCommandPayload>(
    'CreateUserCommandPayload',
    {
      user: 'IUser',
      password: String,
    },
  );
  PojosMetadataMap.create<VerifyEmailAddressCommandPayload>(
    'VerifyEmailAddressCommandPayload',
    {
      token: String,
    },
  );
  PojosMetadataMap.create<SendPasswordResetRequestCommandPayload>(
    'SendPasswordResetRequestCommandPayload',
    {
      email: String,
    },
  );
  PojosMetadataMap.create<ResetPasswordCommandPayload>(
    'ResetPasswordCommandPayload',
    {
      email: String,
      token: String,
      password: String,
      confirmPassword: String,
    },
  );
  PojosMetadataMap.create<ResendEmailAddressVerificationCommandPayload>(
    'ResendEmailAddressVerificationCommandPayload',
    {
      token: String,
    },
  );
  PojosMetadataMap.create<SetUserRolesCommandPayload>(
    'SetUserRolesCommandPayload',
    {
      userId: String,
      roles: [String],
    },
  );
  PojosMetadataMap.create<SetUserProfileCommandPayload>(
    'SetUserProfileCommandPayload',
    {
      userId: String,
      name: String,
      phoneNumber: String,
      agreedToReceiveSmsNotifications: Boolean,
    },
  );
}

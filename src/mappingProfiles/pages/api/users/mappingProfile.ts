import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@jersmart/automapper-core';
import { ITachMappingProfile } from '@/lib/abstractions';
import {
  CreateUserCommandPayload,
  CreateUserViewModel,
  IUser,
  ResendEmailAddressVerificationCommandPayload,
  ResetPasswordCommandPayload,
  ResetPasswordViewModel,
  SendPasswordResetRequestCommandPayload,
  UserViewModel,
  VerifyEmailAddressCommandPayload,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import '../addresses/currentUser/mappingProfile';

@TachMappingProfileClass('pages/api/users/mappingProfile')
export class UserApiIdMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IUser, UserViewModel>(
        mapper,
        'IUser',
        'UserViewModel',
        forMemberId,
      );
      createMap<CreateUserViewModel, IUser>(
        mapper,
        'CreateUserViewModel',
        'IUser',
      );
      createMap<CreateUserViewModel, CreateUserCommandPayload>(
        mapper,
        'CreateUserViewModel',
        'CreateUserCommandPayload',
        forMember(
          (d) => d.user,
          mapFrom((s) =>
            mapper.map<CreateUserViewModel, IUser>(
              s,
              'CreateUserViewModel',
              'IUser',
            ),
          ),
        ),
      );
      createMap<string, VerifyEmailAddressCommandPayload>(
        mapper,
        'string',
        'VerifyEmailAddressCommandPayload',
        forMember(
          (d) => d.token,
          mapFrom((s) => s),
        ),
      );
      createMap<string, SendPasswordResetRequestCommandPayload>(
        mapper,
        'string',
        'SendPasswordResetRequestCommandPayload',
        forMember(
          (d) => d.email,
          mapFrom((s) => s),
        ),
      );
      createMap<ResetPasswordViewModel, ResetPasswordCommandPayload>(
        mapper,
        'ResetPasswordViewModel',
        'ResetPasswordCommandPayload',
      );
      createMap<string, ResendEmailAddressVerificationCommandPayload>(
        mapper,
        'string',
        'ResendEmailAddressVerificationCommandPayload',
        forMember(
          (d) => d.token,
          mapFrom((s) => s),
        ),
      );
    };
  }
}

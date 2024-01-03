import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import { ITachMappingProfile } from '@/lib/abstractions';
import {
  CartItemViewModel,
  CartViewModel,
  CreateUserCommandPayload,
  CreateUserViewModel,
  IProduct,
  IUser,
  MutateUserProfileViewModel,
  ResendEmailAddressVerificationCommandPayload,
  ResetPasswordCommandPayload,
  SendPasswordResetRequestCommandPayload,
  SetUserProfileCommandPayload,
  UnauthenticatedResetPasswordViewModel,
  UserViewModel,
  VerifyEmailAddressCommandPayload,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import '../addresses/currentUser/mappingProfile';
import '../products/mappingProfile';
import { ICart, ICartItem } from '@/models/domain/cart';

@TachMappingProfileClass('pages/api/users/mappingProfile')
export class UserApiIdMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<ICartItem, CartItemViewModel>(
        mapper,
        'ICartItem',
        'CartItemViewModel',
      );
      createMap<ICart, CartViewModel>(mapper, 'ICart', 'CartViewModel');
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
        forMember(
          (d) => d.cart,
          mapFrom((s) => ({ items: [] })),
        ),
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
      createMap<
        UnauthenticatedResetPasswordViewModel,
        ResetPasswordCommandPayload
      >(
        mapper,
        'UnauthenticatedResetPasswordViewModel',
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
      createMap<MutateUserProfileViewModel, SetUserProfileCommandPayload>(
        mapper,
        'MutateUserProfileViewModel',
        'SetUserProfileCommandPayload',
        forMember(
          (d) => d.userId,
          mapWithArguments((s, { userId }) => userId),
        ),
      );
    };
  }
}

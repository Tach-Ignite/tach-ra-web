import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapWithArguments,
} from '@jersmart/automapper-core';
import { ITachMappingProfile } from '@/lib/abstractions';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import {
  IUser,
  SetUserRolesCommandPayload,
  SetUserRolesViewModel,
  UserViewModel,
} from '@/models';
import '../../addresses/currentUser/mappingProfile';

@TachMappingProfileClass('pages/api/users/[id]/mappingProfile')
export class USerApiIdMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IUser, UserViewModel>(
        mapper,
        'IUser',
        'UserViewModel',
        forMemberId,
      );
      createMap<SetUserRolesViewModel, SetUserRolesCommandPayload>(
        mapper,
        'SetUserRolesViewModel',
        'SetUserRolesCommandPayload',
        forMember(
          (d) => d.userId,
          mapWithArguments((s, { userId }) => userId),
        ),
      );
    };
  }
}

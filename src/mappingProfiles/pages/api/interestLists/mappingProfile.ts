import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import {
  ITachMappingProfile,
  ValidateRecaptchaTokenCommandPayload,
} from '@/lib/abstractions';
import { IInterestList, IInterestListItem } from '@/models/domain/interestList';
import {
  InterestListDto,
  InterestListItemDto,
} from '@/models/dtos/interestList';
import {
  AddUserToInterestListViewModel,
  InterestListItemViewModel,
  InterestListViewModel,
} from '@/models/viewModels/interestLists';
import { CreateInterestListCommandPayload } from '@/models/commands/payloads/interestLists/createInterestListCommandPayload';
import { CreateInterestListItemCommandPayload } from '@/models/commands/payloads/interestLists/createInterestListItemCommandPayload';

@TachMappingProfileClass('pages/api/interestLists/mappingProfile')
export class AddressApiCurrentUserMappingProfile
  implements ITachMappingProfile
{
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<
        AddUserToInterestListViewModel,
        ValidateRecaptchaTokenCommandPayload
      >(
        mapper,
        'AddUserToInterestListViewModel',
        'ValidateRecaptchaTokenCommandPayload',
      );
      createMap<AddUserToInterestListViewModel, IInterestList>(
        mapper,
        'AddUserToInterestListViewModel',
        'IInterestList',
        forMember(
          (d) => d.friendlyId,
          mapFrom((s) => s.interestListFriendlyId),
        ),
      );
      createMap<AddUserToInterestListViewModel, IInterestListItem>(
        mapper,
        'AddUserToInterestListViewModel',
        'IInterestListItem',
        forMember(
          (d) => d.interestList,
          mapWithArguments((s, { interestList }) => interestList),
        ),
      );
      createMap<
        AddUserToInterestListViewModel,
        CreateInterestListCommandPayload
      >(
        mapper,
        'AddUserToInterestListViewModel',
        'CreateInterestListCommandPayload',
        forMember(
          (d) => d.interestList,
          mapFrom((s) =>
            mapper.map<AddUserToInterestListViewModel, IInterestList>(
              s,
              'AddUserToInterestListViewModel',
              'IInterestList',
            ),
          ),
        ),
      );
      createMap<AddUserToInterestListViewModel, IInterestListItem>(
        mapper,
        'InterestListItemDto',
        'IInterestListItem',
        forMemberId,
        forMember(
          (d) => d.interestList,
          mapWithArguments((s, { interestList }) => interestList),
        ),
      );
      createMap<
        AddUserToInterestListViewModel,
        CreateInterestListItemCommandPayload
      >(
        mapper,
        'AddUserToInterestListViewModel',
        'CreateInterestListItemCommandPayload',
        forMember(
          (d) => d.interestListItem,
          mapWithArguments((s, { interestList }) =>
            mapper.map<AddUserToInterestListViewModel, IInterestListItem>(
              s,
              'AddUserToInterestListViewModel',
              'IInterestListItem',
              { extraArgs: () => ({ interestList }) },
            ),
          ),
        ),
      );
      createMap<IInterestList, InterestListViewModel>(
        mapper,
        'IInterestList',
        'InterestListViewModel',
        forMemberId,
      );
    };
  }
}

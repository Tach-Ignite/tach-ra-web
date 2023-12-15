import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import { ITachMappingProfile } from '@/lib/abstractions';
import { IInterestList, IInterestListItem } from '@/models/domain/interestList';
import {
  InterestListDto,
  InterestListItemDto,
} from '@/models/dtos/interestList';

@TachMappingProfileClass('services/interestLists/mappingProfile')
export class AddressApiCurrentUserMappingProfile
  implements ITachMappingProfile
{
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IInterestList, InterestListDto>(
        mapper,
        'IInterestList',
        'InterestListDto',
        forMemberId,
      );
      createMap<IInterestListItem, InterestListItemDto>(
        mapper,
        'IInterestListItem',
        'InterestListItemDto',
        forMemberId,
        forMember(
          (d) => d.interestListId,
          mapFrom((s) => s.interestList._id),
        ),
      );
      createMap<InterestListItemDto, IInterestListItem>(
        mapper,
        'InterestListItemDto',
        'IInterestListItem',
        forMemberId,
        forMember(
          (d) => d.interestList,
          mapWithArguments((s, { interestList }) =>
            mapper.map<InterestListDto, IInterestList>(
              interestList as InterestListDto,
              'InterestListDto',
              'IInterestList',
            ),
          ),
        ),
      );
      createMap<InterestListDto, IInterestList>(
        mapper,
        'InterestListDto',
        'IInterestList',
        forMemberId,
      );
    };
  }
}

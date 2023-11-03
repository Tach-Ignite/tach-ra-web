import {
  MappingProfile,
  Mapper,
  createMap,
  forMember,
  mapWithArguments,
  mapFrom,
} from '@jersmart/automapper-core';
import { ITachMappingProfile } from '@/lib/abstractions';
import {
  CategoryDto,
  CategoryPropertyDto,
  ICategory,
  ICategoryProperty,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';

@TachMappingProfileClass('services/addresses/categories/mappingProfile')
export class CategoryServiceMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<ICategoryProperty, CategoryPropertyDto>(
        mapper,
        'ICategoryProperty',
        'CategoryPropertyDto',
        forMemberId,
      );
      createMap<CategoryPropertyDto, ICategoryProperty>(
        mapper,
        'CategoryPropertyDto',
        'ICategoryProperty',
        forMemberId,
      );
      createMap<ICategory, CategoryDto>(
        mapper,
        'ICategory',
        'CategoryDto',
        forMemberId,
        forMember(
          (d) => d.parentId,
          mapFrom((s) => s.parent?._id),
        ),
      );
      createMap<CategoryDto, ICategory>(
        mapper,
        'CategoryDto',
        'ICategory',
        forMemberId,
        forMember(
          (d) => d.parent,
          mapWithArguments((s, { parentCategoryDto }) => {
            if (parentCategoryDto) {
              return mapper.map<CategoryDto, ICategory>(
                parentCategoryDto as CategoryDto,
                'CategoryDto',
                'ICategory',
              );
            }
            return null;
          }),
        ),
      );
    };
  }
}

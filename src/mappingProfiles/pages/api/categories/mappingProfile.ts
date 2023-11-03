import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@jersmart/automapper-core';
import {
  AddCategoryCommandPayload,
  CategoryPropertyViewModel,
  CategoryViewModel,
  MutateCategoryPropertyViewModel,
  MutateCategoryViewModel,
  ICategory,
  ICategoryProperty,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import { ITachMappingProfile } from '@/lib/abstractions';

@TachMappingProfileClass('pages/api/categories/mappingProfile')
export class CategoryApiMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<ICategoryProperty, CategoryPropertyViewModel>(
        mapper,
        'ICategoryProperty',
        'CategoryPropertyViewModel',
        forMemberId,
      );
      createMap<ICategory, CategoryViewModel>(
        mapper,
        'ICategoryParent',
        'CategoryViewModelParent',
        forMemberId,
      );
      createMap<ICategory, CategoryViewModel>(
        mapper,
        'ICategory',
        'CategoryViewModel',
        forMemberId,
      );
      createMap<MutateCategoryPropertyViewModel, ICategoryProperty>(
        mapper,
        'MutateCategoryPropertyViewModel',
        'ICategoryProperty',
        forMemberId,
        forMember(
          (d) => d.values,
          mapFrom((s) => s.values.split(',').map((v) => v.trim())),
        ),
      );
      createMap<MutateCategoryViewModel, ICategory>(
        mapper,
        'MutateCategoryViewModel',
        'ICategory',
        forMemberId,
        forMember(
          (d) => d.parent,
          mapFrom(
            (s) =>
              ({
                name: '',
                _id: s.parentId,
              }) as unknown as ICategory,
          ),
        ),
      );
      createMap<MutateCategoryViewModel, AddCategoryCommandPayload>(
        mapper,
        'MutateCategoryViewModel',
        'AddCategoryCommandPayload',
        forMember(
          (d) => d.category,
          mapFrom((s) =>
            mapper.map<MutateCategoryViewModel, ICategory>(
              s,
              'MutateCategoryViewModel',
              'ICategory',
            ),
          ),
        ),
      );
    };
  }
}

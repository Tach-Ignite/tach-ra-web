import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import {
  CategoryPropertyViewModel,
  CategoryViewModel,
  DeleteCategoryCommandPayload,
  EditCategoryCommandPayload,
  ICategory,
  ICategoryProperty,
  MutateCategoryPropertyViewModel,
  MutateCategoryViewModel,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import { ITachMappingProfile } from '@/lib/abstractions';

@TachMappingProfileClass('pages/api/categories/[id]/mappingProfile')
export class CategoryApiIdMappingProfile implements ITachMappingProfile {
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
      createMap<ICategory, MutateCategoryViewModel>(
        mapper,
        'ICategory',
        'MutateCategoryViewModel',
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
      createMap<MutateCategoryViewModel, EditCategoryCommandPayload>(
        mapper,
        'MutateCategoryViewModel',
        'EditCategoryCommandPayload',
        forMember(
          (d) => d.categoryId,
          mapWithArguments((s, { categoryId }) => categoryId),
        ),
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
      createMap<string, DeleteCategoryCommandPayload>(
        mapper,
        'string',
        'DeleteCategoryCommandPayload',
        forMember(
          (d) => d.categoryId,
          mapFrom((s) => s),
        ),
      );
    };
  }
}

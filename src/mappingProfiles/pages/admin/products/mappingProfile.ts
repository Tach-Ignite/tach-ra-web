import { Mapper, MappingProfile, createMap } from '@jersmart/automapper-core';

import { ITachMappingProfile } from '@/lib/abstractions';

import {
  CategoryPropertyViewModel,
  CategoryViewModel,
  ICategory,
  ICategoryProperty,
  ProductViewModel,
  IProduct,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';

@TachMappingProfileClass('pages/admin/products/mappingProfile')
export class AdminProductPageMappingProfile implements ITachMappingProfile {
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
      createMap<IProduct, ProductViewModel>(
        mapper,
        'IProduct',
        'ProductViewModel',
        forMemberId,
      );
    };
  }
}

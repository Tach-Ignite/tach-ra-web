import {
  MappingProfile,
  Mapper,
  createMap,
  forMember,
  mapWithArguments,
  mapFrom,
} from '@jersmart/automapper-core';
import { ITachMappingProfile } from '@/lib/abstractions';
import { ProductDto, IProduct } from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';

@TachMappingProfileClass('services/products/mappingProfile')
export class ProductServiceMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IProduct, ProductDto>(
        mapper,
        'IProduct',
        'ProductDto',
        forMemberId,
        forMember(
          (d) => d.categoryIds,
          mapFrom((s) => s.categories.map((c) => c._id)),
        ),
        forMember(
          (d) => d.imageStorageKeys,
          mapWithArguments((s, { imageStorageKeys }) => imageStorageKeys),
        ),
      );
      createMap<ProductDto, IProduct>(
        mapper,
        'ProductDto',
        'IProduct',
        forMemberId,
        forMember(
          (d) => d.categories,
          mapWithArguments((s, { categories }) => categories),
        ),
        forMember(
          (d) => d.imageUrls,
          mapWithArguments((x, { imageUrls }) => imageUrls),
        ),
      );
    };
  }
}

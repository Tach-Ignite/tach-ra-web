import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import {
  ITachMappingProfile,
  MultipartFormParserResult,
} from '@/lib/abstractions';
import {
  CategoryPropertyViewModel,
  CategoryViewModel,
  DeleteProductCommandPayload,
  EditProductCommandPayload,
  ICategory,
  ICategoryProperty,
  IProduct,
  MutateProductViewModel,
  ProductViewModel,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';

@TachMappingProfileClass('pages/api/products/[id]/mappingProfile')
export class ProductApiIdMappingProfile implements ITachMappingProfile {
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
      createMap<MultipartFormParserResult, IProduct>(
        mapper,
        'MultipartFormParserResult',
        'IProduct',
        forMember(
          (d) => d.brand,
          mapFrom((s) => s.fields.brand),
        ),
        forMember(
          (d) => d.description,
          mapFrom((s) => s.fields.description),
        ),
        forMember(
          (d) => d.friendlyId,
          mapFrom((s) => s.fields.friendlyId),
        ),
        forMember(
          (d) => d.name,
          mapFrom((s) => s.fields.name),
        ),
        forMember(
          (d) => d.isNew,
          mapFrom((s) => s.fields.isNew === 'true'),
        ),
        forMember(
          (d) => d.oldPrice,
          mapFrom((s) => Number(s.fields.oldPrice)),
        ),
        forMember(
          (d) => d.price,
          mapFrom((s) => Number(s.fields.price)),
        ),
        forMember(
          (d) => d.quantity,
          mapFrom((s) => Number(s.fields.quantity)),
        ),
        forMember(
          (d) => d.categories,
          mapFrom((s) =>
            s.fields.categoryIds
              ? JSON.parse(s.fields.categoryIds).map((c: any) => ({ _id: c }))
              : [],
          ),
        ),
        forMember(
          (d) => d.categoryPropertyValues,
          mapFrom((s) =>
            s.fields.categoryPropertyValues
              ? JSON.parse(s.fields.categoryPropertyValues)
              : {},
          ),
        ),
      );
      createMap<MutateProductViewModel, IProduct>(
        mapper,
        'MutateProductViewModel',
        'IProduct',
        forMember(
          (d) => d.categories,
          mapFrom((s) => s.categoryIds.map((c) => ({ _id: c }) as any)),
        ),
      );
      createMap<MultipartFormParserResult, EditProductCommandPayload>(
        mapper,
        'MultipartFormParserResult',
        'EditProductCommandPayload',
        forMember(
          (d) => d.productId,
          mapWithArguments((s, { productId }) => productId),
        ),
        forMember(
          (d) => d.product,
          mapFrom((s) =>
            mapper.map<MultipartFormParserResult, IProduct>(
              s,
              'MultipartFormParserResult',
              'IProduct',
            ),
          ),
        ),
        forMember(
          (d) => d.productImages,
          mapFrom((s) => Object.keys(s.files).map((k) => s.files[k])),
        ),
      );
      createMap<MutateProductViewModel, EditProductCommandPayload>(
        mapper,
        'MutateProductViewModel',
        'EditProductCommandPayload',
        forMember(
          (d) => d.productId,
          mapWithArguments((s, { productId }) => productId),
        ),
        forMember(
          (d) => d.product,
          mapFrom((s) =>
            mapper.map<MutateProductViewModel, IProduct>(
              s,
              'MutateProductViewModel',
              'IProduct',
            ),
          ),
        ),
      );
      createMap<string, DeleteProductCommandPayload>(
        mapper,
        'string',
        'DeleteProductCommandPayload',
        forMember(
          (d) => d.productId,
          mapFrom((s) => s),
        ),
      );
    };
  }
}

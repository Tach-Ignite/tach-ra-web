import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  forSelf,
  mapFrom,
} from '@jersmart/automapper-core';
import {
  MultipartFormParserResult,
  ITachMappingProfile,
  QueryOptions,
} from '@/lib/abstractions';
import {
  CategoryPropertyViewModel,
  CategoryViewModel,
  CreateProductCommandPayload,
  ICategory,
  ICategoryProperty,
  ProductViewModel,
  IProduct,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';

@TachMappingProfileClass('pages/api/products/mappingProfile')
export class ProductApiMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<
        Partial<{
          [key: string]: string | string[];
        }>,
        QueryOptions | undefined
      >(
        mapper,
        'query',
        'QueryOptions',
        forSelf('QueryOptions', (s) => {
          if (s.l === undefined || s.l === undefined) {
            return undefined;
          }
          let skipValue: string | undefined;
          if (Array.isArray(s.s) && s.s.length > 0) {
            [skipValue] = s.s;
          }
          skipValue = s.s as string;

          if (skipValue === undefined) {
            return undefined;
          }
          const skip = parseInt(skipValue, 10);

          let limitValue: string | undefined;
          if (Array.isArray(s.l) && s.l.length > 0) {
            [limitValue] = s.l;
          }
          limitValue = s.l as string;

          if (limitValue === undefined) {
            return undefined;
          }
          const limit = parseInt(limitValue, 10);

          if (limit === undefined || skip === undefined) {
            return undefined;
          }

          return { skip, limit };
        }),
      );
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
      createMap<MultipartFormParserResult, CreateProductCommandPayload>(
        mapper,
        'MultipartFormParserResult',
        'CreateProductCommandPayload',
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
    };
  }
}

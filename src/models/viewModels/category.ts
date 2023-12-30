import { JSONSchemaType } from 'ajv';
import {
  IdModel,
  idModelSchema,
  timeStampedModelSchema,
} from '@/lib/abstractions';

export type CategoryPropertyViewModel = {
  name: string;
  values: string[];
} & IdModel;

export const categoryPropertyViewModelSchema: JSONSchemaType<CategoryPropertyViewModel> =
  {
    type: 'object',
    properties: {
      ...idModelSchema.properties,
      name: { type: 'string' },
      values: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['name', 'values'],
  };

export type CategoryViewModel = {
  name: string;
  parent?: CategoryViewModel;
  categoryProperties: CategoryPropertyViewModel[];
} & IdModel;

export const categoryViewModelSchema: JSONSchemaType<CategoryViewModel> = {
  type: 'object',
  properties: {
    ...idModelSchema.properties,
    name: { type: 'string' },
    parent: {
      $ref: '#',
    },
    categoryProperties: {
      type: 'array',
      items: categoryPropertyViewModelSchema,
    },
  },
  required: ['name', 'categoryProperties'],
  additionalProperties: false,
};

export type MutateCategoryPropertyViewModel = {
  name: string;
  values: string;
} & Partial<IdModel>;

export const mutateCategoryPropertyViewModelSchema: JSONSchemaType<MutateCategoryPropertyViewModel> =
  {
    type: 'object',
    properties: {
      ...idModelSchema.properties,
      name: { type: 'string' },
      values: {
        type: 'string',
      },
    },
    required: ['name', 'values'],
  };

export type MutateCategoryViewModel = {
  name: string;
  parentId?: string;
  categoryProperties?: MutateCategoryPropertyViewModel[];
};

export const mutateCategoryViewModelSchema: JSONSchemaType<MutateCategoryViewModel> =
  {
    type: 'object',
    properties: {
      ...idModelSchema.properties,
      name: { type: 'string' },
      parentId: { type: 'string', nullable: true },
      categoryProperties: {
        type: 'array',
        nullable: true,
        items: mutateCategoryPropertyViewModelSchema,
      },
    },
    required: ['name'],
    additionalProperties: false,
  };

export type CategoryPropertyValueViewModel = {
  categoryId: string;
  categoryPropertyId: string;
  value: string;
};

export const categoryPropertyValueViewModelSchema: JSONSchemaType<CategoryPropertyValueViewModel> =
  {
    type: 'object',
    properties: {
      categoryId: {
        type: 'string',
      },
      categoryPropertyId: {
        type: 'string',
      },
      value: {
        type: 'string',
      },
    },
    required: ['categoryId', 'categoryPropertyId', 'value'],
  };

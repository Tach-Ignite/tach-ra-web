import { JSONSchemaType } from 'ajv';
import {
  PartialIdModelAndTimestampModel,
  partialIdModelSchema,
  timeStampedModelSchema,
} from '@/lib/abstractions';
import { ICategory, categorySchema } from './category';

export interface ICategoryPropertyValue {
  categoryId: string;
  categoryPropertyId: string;
  value: string;
}

export const categoryPropertyValueSchema: JSONSchemaType<ICategoryPropertyValue> =
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

export interface IProduct extends PartialIdModelAndTimestampModel {
  friendlyId: string;
  brand: string;
  name: string;
  description: string;
  isNew: boolean;
  oldPrice: number;
  price: number;
  quantity: number;
  categoryPropertyValues: { [key: string]: ICategoryPropertyValue };
  categories: ICategory[];
  imageUrls: string[];
}

export const productSchema: JSONSchemaType<IProduct> = {
  type: 'object',
  properties: {
    ...partialIdModelSchema.properties,
    ...timeStampedModelSchema.properties,
    friendlyId: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Friendly Id is required.' },
    },
    brand: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Name is required.' },
    },
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Name is required.' },
    },
    description: {
      type: 'string',
      minLength: 1,
      errorMessage: { const: 'Description is required.' },
    },
    isNew: {
      type: 'boolean',
    },
    oldPrice: {
      type: 'number',
      minimum: 0,
      multipleOf: 0.01,
      errorMessage: { nullable: 'Price is required.' },
    },
    price: {
      type: 'number',
      minimum: 0,
      multipleOf: 0.01,
      errorMessage: { nullable: 'Price is required.' },
    },
    quantity: {
      type: 'integer',
      errorMessage: { const: 'Quantity is required.' },
    },
    categoryPropertyValues: {
      type: 'object',
      patternProperties: {
        '^[a-zA-Z0-9]*$': {
          type: 'object',
          properties: {
            ...categoryPropertyValueSchema.properties,
          },
          required: [...categoryPropertyValueSchema.required],
        },
      },
      required: [],
    },
    categories: {
      type: 'array',
      items: categorySchema,
    },
    imageUrls: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uri',
      },
    },
  },
  required: [
    'friendlyId',
    'name',
    'description',
    'brand',
    'isNew',
    'price',
    'quantity',
    'categories',
    'imageUrls',
  ],
  additionalProperties: true,
};

import { JSONSchemaType } from 'ajv';
import {
  IdModel,
  TimeStampedModel,
  idModelSchema,
  timeStampedModelSchema,
} from '@/lib/abstractions';
import {
  CategoryPropertyValueViewModel,
  CategoryViewModel,
  categoryPropertyValueViewModelSchema,
  categoryViewModelSchema,
} from './category';

type ProductViewModelBase = {
  friendlyId: string;
  brand: string;
  name: string;
  description: string;
  isNew: boolean;
  oldPrice: number;
  price: number;
  quantity: number;
  categoryPropertyValues?: { [key: string]: CategoryPropertyValueViewModel };
};
export const productViewModelBaseMetadata = {
  friendlyId: String,
  brand: String,
  name: String,
  description: String,
  isNew: Boolean,
  oldPrice: Number,
  price: Number,
  quantity: Number,
  categoryPropertyValues: Object,
};

const productViewModelBaseSchema: JSONSchemaType<ProductViewModelBase> = {
  type: 'object',
  properties: {
    friendlyId: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Friendly Id is required.' },
    },
    brand: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Brand is required.' },
    },
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Name is required.' },
    },
    description: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'Description is required.' },
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
      nullable: true,
      patternProperties: {
        '^[a-zA-Z0-9]*$': categoryPropertyValueViewModelSchema,
      },
      required: [],
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
  ],
};

export type ProductViewModel = {
  categories: CategoryViewModel[];
  imageUrls: string[];
} & ProductViewModelBase &
  IdModel &
  TimeStampedModel;

export const productViewModelSchema: JSONSchemaType<ProductViewModel> = {
  type: 'object',
  properties: {
    ...idModelSchema.properties,
    ...timeStampedModelSchema.properties,
    ...productViewModelBaseSchema.properties,
    categories: {
      type: 'array',
      items: categoryViewModelSchema,
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
    ...idModelSchema.required,
    ...timeStampedModelSchema.required,
    ...productViewModelBaseSchema.required,
    'categories',
    'imageUrl',
  ],
  additionalProperties: false,
};

export type MutateProductViewModel = {
  categoryIds: string[];
  imageFiles?: FileList;
} & ProductViewModelBase;

export const mutateProductViewModelSchema: JSONSchemaType<MutateProductViewModel> =
  {
    type: 'object',
    properties: {
      ...productViewModelBaseSchema.properties!,
      categoryIds: {
        type: 'array',
        items: {
          type: 'string',
          minLength: 1,
          errorMessage: {
            minLength: 'Category Ids cannot be empty, null, or undefined.',
          },
        },
      },
      imageFiles: {
        type: 'object',
        nullable: true,
        required: ['item', 'length'],
      },
    },
    required: [...productViewModelBaseSchema.required, 'categoryIds'],
    additionalProperties: false,
  };

export type DeleteProductViewModel = {
  confirmationMessage: string;
};

export const deleteProductViewModelSchema: JSONSchemaType<DeleteProductViewModel> =
  {
    type: 'object',
    properties: {
      confirmationMessage: {
        type: 'string',
        const: 'permanently delete',
      },
    },
    required: ['confirmationMessage'],
  };

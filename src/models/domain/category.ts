import { JSONSchemaType } from 'ajv';
import { IdModel, partialIdModelSchema } from '@/lib/abstractions';

export interface ICategoryProperty extends Partial<IdModel> {
  name: string;
  values: string[];
}

export const categoryPropertySchema: JSONSchemaType<ICategoryProperty> = {
  type: 'object',
  properties: {
    ...partialIdModelSchema.properties,
    name: { type: 'string' },
    values: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['name', 'values'],
  additionalProperties: false,
};

export interface ICategory extends Partial<IdModel> {
  name: string;
  parent?: ICategory;
  children?: ICategory[];
  categoryProperties?: ICategoryProperty[];
}

export const categorySchema: JSONSchemaType<ICategory> = {
  type: 'object',
  properties: {
    ...partialIdModelSchema.properties,
    name: { type: 'string' },
    parent: {
      $ref: '#',
      type: 'object',
      nullable: true,
    },
    children: {
      type: 'array',
      nullable: true,
      items: {
        $ref: '#',
      },
    },
    categoryProperties: {
      type: 'array',
      items: categoryPropertySchema,
      nullable: true,
    },
  },
  required: ['name'],
  additionalProperties: false,
};

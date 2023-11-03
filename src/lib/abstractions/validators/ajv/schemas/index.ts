import { JSONSchemaType } from 'ajv';
import {
  BaseModel,
  IdModel,
  QueryOptions,
  TimeStampedModel,
} from '../../../interfaces/interfaces';
import { IAddress } from '../../../interfaces/payment/shared';

export const idModelSchema: JSONSchemaType<IdModel> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
  },
  required: ['_id'],
};

export const partialIdModelSchema: JSONSchemaType<Partial<IdModel>> = {
  type: 'object',
  properties: {
    _id: { type: 'string', nullable: true },
  },
};

export const timeStampedModelSchema: JSONSchemaType<TimeStampedModel> = {
  type: 'object',
  properties: {
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['createdAt', 'updatedAt'],
};

export const baseModelSchema: JSONSchemaType<BaseModel> = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      errorMessage: { const: '_id is required.' },
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['_id', 'createdAt', 'updatedAt'],
  additionalProperties: false,
};

export const addressSchema: JSONSchemaType<IAddress> = {
  type: 'object',
  properties: {
    lineOne: { type: 'string' },
    lineTwo: { type: 'string', nullable: true },
    city: { type: 'string' },
    state: { type: 'string' },
    country: { type: 'string' },
    postalCode: { type: 'string' },
  },
  required: ['lineOne', 'city', 'state', 'country', 'postalCode'],
  additionalProperties: false,
};

export const queryOptionsSchema: JSONSchemaType<QueryOptions> = {
  type: 'object',
  nullable: true,
  properties: {
    skip: {
      type: 'integer',
      minimum: 0,
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 1000,
    },
  },
  required: ['skip', 'limit'],
};

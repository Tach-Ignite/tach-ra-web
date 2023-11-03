import { JSONSchemaType } from 'ajv';
import { IdModel, idModelSchema } from '@/lib/abstractions';
import { IAddress, addressSchema } from './address';

export interface IUserAddress {
  _id: string;
  recipientName: string;
  address: IAddress & Partial<IdModel>;
}

export const userAddressSchema: JSONSchemaType<IUserAddress> = {
  type: 'object',
  properties: {
    ...idModelSchema.properties,
    recipientName: { type: 'string' },
    address: addressSchema,
  },
  required: ['_id', 'recipientName', 'address'],
  additionalProperties: false,
};

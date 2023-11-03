import { JSONSchemaType } from 'ajv';
import {
  IAddress as IAddressInternal,
  IdModel,
  partialIdModelSchema,
  addressSchema as addressSchemaInternal,
  ICountryCodeEnum,
} from '@/lib/abstractions';

type IAddressInternalAndPartialIdModel = IAddressInternal & Partial<IdModel>;

export interface IAddress extends IAddressInternalAndPartialIdModel {
  country: Extract<keyof ICountryCodeEnum, string>;
}

export const addressSchema: JSONSchemaType<IAddress> = {
  type: 'object',
  properties: {
    ...partialIdModelSchema.properties,
    ...addressSchemaInternal.properties,
  },
  required: ['lineOne', 'city', 'state', 'country', 'postalCode'],
  additionalProperties: false,
};

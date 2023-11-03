import { ICountryCodeEnum } from '@/lib/abstractions';
import { EnumFactory } from '../enumFactory';

const enumFactory = new EnumFactory();
export const CountryCodeEnum: ICountryCodeEnum = enumFactory.create({
  US: 'United States',
}) as ICountryCodeEnum;

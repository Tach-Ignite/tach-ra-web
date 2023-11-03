import { ICurrencyCodeEnum, IPaymentStatusEnum } from '@/lib/abstractions';
import { EnumFactory } from '../enumFactory';

const enumFactory = new EnumFactory();
export const PaymentStatusEnum: IPaymentStatusEnum = enumFactory.create({
  Paid: 'Paid',
  Unpaid: 'Unpaid',
  Refunded: 'Refunded',
}) as IPaymentStatusEnum;

export const CurrencyCodeEnum: ICurrencyCodeEnum = enumFactory.create({
  USD: 'United States Dollar',
}) as ICurrencyCodeEnum;

export interface IEnum extends Record<string, any> {
  [x: string]: any;
  reverseLookup(value: string): string;
  _keys: string[];
  _values: any[];
  _object: any;
}

export interface IEnumFactory {
  create<T extends IEnum>(enumValues: Object): T;
}

export interface ICountryCodeEnum extends IEnum {
  US: string;
}

export interface IPaymentStatusEnum extends IEnum {
  Paid: string;
  Unpaid: string;
  Refunded: string;
}

export interface ICurrencyCodeEnum extends IEnum {
  USD: string;
}

export interface INpmLoggingLevels extends IEnum {
  error: number;
  warn: number;
  info: number;
  http: number;
  verbose: number;
  debug: number;
  silly: number;
}

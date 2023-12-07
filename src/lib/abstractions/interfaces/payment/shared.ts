import { NextApiRequest } from 'next';
import {
  ICountryCodeEnum,
  ICurrencyCodeEnum,
  IPaymentStatusEnum,
} from '../enums';
import { IMapper } from '../mapping';

export type CountryCode =
  | 'AC'
  | 'AD'
  | 'AE'
  | 'AF'
  | 'AG'
  | 'AI'
  | 'AL'
  | 'AM'
  | 'AO'
  | 'AQ'
  | 'AR'
  | 'AT'
  | 'AU'
  | 'AW'
  | 'AX'
  | 'AZ'
  | 'BA'
  | 'BB'
  | 'BD'
  | 'BE'
  | 'BF'
  | 'BG'
  | 'BH'
  | 'BI'
  | 'BJ'
  | 'BL'
  | 'BM'
  | 'BN'
  | 'BO'
  | 'BQ'
  | 'BR'
  | 'BS'
  | 'BT'
  | 'BV'
  | 'BW'
  | 'BY'
  | 'BZ'
  | 'CA'
  | 'CD'
  | 'CF'
  | 'CG'
  | 'CH'
  | 'CI'
  | 'CK'
  | 'CL'
  | 'CM'
  | 'CN'
  | 'CO'
  | 'CR'
  | 'CV'
  | 'CW'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DJ'
  | 'DK'
  | 'DM'
  | 'DO'
  | 'DZ'
  | 'EC'
  | 'EE'
  | 'EG'
  | 'EH'
  | 'ER'
  | 'ES'
  | 'ET'
  | 'FI'
  | 'FJ'
  | 'FK'
  | 'FO'
  | 'FR'
  | 'GA'
  | 'GB'
  | 'GD'
  | 'GE'
  | 'GF'
  | 'GG'
  | 'GH'
  | 'GI'
  | 'GL'
  | 'GM'
  | 'GN'
  | 'GP'
  | 'GQ'
  | 'GR'
  | 'GS'
  | 'GT'
  | 'GU'
  | 'GW'
  | 'GY'
  | 'HK'
  | 'HN'
  | 'HR'
  | 'HT'
  | 'HU'
  | 'ID'
  | 'IE'
  | 'IL'
  | 'IM'
  | 'IN'
  | 'IO'
  | 'IQ'
  | 'IS'
  | 'IT'
  | 'JE'
  | 'JM'
  | 'JO'
  | 'JP'
  | 'KE'
  | 'KG'
  | 'KH'
  | 'KI'
  | 'KM'
  | 'KN'
  | 'KR'
  | 'KW'
  | 'KY'
  | 'KZ'
  | 'LA'
  | 'LB'
  | 'LC'
  | 'LI'
  | 'LK'
  | 'LR'
  | 'LS'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'LY'
  | 'MA'
  | 'MC'
  | 'MD'
  | 'ME'
  | 'MF'
  | 'MG'
  | 'MK'
  | 'ML'
  | 'MM'
  | 'MN'
  | 'MO'
  | 'MQ'
  | 'MR'
  | 'MS'
  | 'MT'
  | 'MU'
  | 'MV'
  | 'MW'
  | 'MX'
  | 'MY'
  | 'MZ'
  | 'NA'
  | 'NC'
  | 'NE'
  | 'NG'
  | 'NI'
  | 'NL'
  | 'NO'
  | 'NP'
  | 'NR'
  | 'NU'
  | 'NZ'
  | 'OM'
  | 'PA'
  | 'PE'
  | 'PF'
  | 'PG'
  | 'PH'
  | 'PK'
  | 'PL'
  | 'PM'
  | 'PN'
  | 'PR'
  | 'PS'
  | 'PT'
  | 'PY'
  | 'QA'
  | 'RE'
  | 'RO'
  | 'RS'
  | 'RU'
  | 'RW'
  | 'SA'
  | 'SB'
  | 'SC'
  | 'SE'
  | 'SG'
  | 'SH'
  | 'SI'
  | 'SJ'
  | 'SK'
  | 'SL'
  | 'SM'
  | 'SN'
  | 'SO'
  | 'SR'
  | 'SS'
  | 'ST'
  | 'SV'
  | 'SX'
  | 'SZ'
  | 'TA'
  | 'TC'
  | 'TD'
  | 'TF'
  | 'TG'
  | 'TH'
  | 'TJ'
  | 'TK'
  | 'TL'
  | 'TM'
  | 'TN'
  | 'TO'
  | 'TR'
  | 'TT'
  | 'TV'
  | 'TW'
  | 'TZ'
  | 'UA'
  | 'UG'
  | 'US'
  | 'UY'
  | 'UZ'
  | 'VA'
  | 'VC'
  | 'VE'
  | 'VG'
  | 'VN'
  | 'VU'
  | 'WF'
  | 'WS'
  | 'XK'
  | 'YE'
  | 'YT'
  | 'ZA'
  | 'ZM'
  | 'ZW'
  | 'ZZ';

export type PaymentMethodType =
  | 'acss_debit'
  | 'affirm'
  | 'afterpay_clearpay'
  | 'alipay'
  | 'au_becs_debit'
  | 'bacs_debit'
  | 'bancontact'
  | 'blik'
  | 'boleto'
  | 'card'
  | 'cashapp'
  | 'customer_balance'
  | 'eps'
  | 'fpx'
  | 'giropay'
  | 'grabpay'
  | 'ideal'
  | 'klarna'
  | 'konbini'
  | 'link'
  | 'oxxo'
  | 'p24'
  | 'paynow'
  | 'paypal'
  | 'pix'
  | 'promptpay'
  | 'sepa_debit'
  | 'sofort'
  | 'us_bank_account'
  | 'wechat_pay'
  | 'zip';

export type PaymentIntentMode = 'payment' | 'setup' | 'subscription';

export interface IProductData {
  _id: string;
  name: string;
  description: string;
  imageUrls: string[];
}

export interface IPriceData {
  currency: Extract<keyof ICurrencyCodeEnum, string>;
  unitAmount: number;
  productData: IProductData;
  taxBehavior?: string;
}

export interface ILineItem {
  quantity: number;
  priceData: IPriceData;
}

export interface IShippingInformation {
  address: IAddress;
  recipientName: string;
}

export interface ICreatePaymentIntentRequest {
  paymentMethodTypes: PaymentMethodType[];
  shippingInformation?: IShippingInformation;
  customerEmail: string;
  lineItems: ILineItem[];
  mode: string;
  successUrl: string;
  cancelUrl: string;
  orderId: string;
}

export interface IAddress {
  lineOne: string;
  lineTwo?: string;
  city: string;
  state: string;
  country: Extract<keyof ICountryCodeEnum, string>;
  postalCode: string;
}

export interface IShippingDetails {
  address: IAddress;
}

export interface IConfirmPaymentIntentRequest {
  orderId: string;
  checkoutSessionId: string;
  paymentStatus: Extract<keyof IPaymentStatusEnum, string>;
  paymentProvider: string;
}

export interface ICreateCheckoutSessionResponse {
  checkoutSessionId: string;
  checkoutSessionUrl: string | null;
}

export interface IPaymentService {
  createCheckoutSession(
    request: ICreatePaymentIntentRequest,
    mapper: IMapper,
  ): Promise<ICreateCheckoutSessionResponse>;
  confirmCheckoutSession(
    request: IConfirmPaymentIntentRequest,
    mapper: IMapper,
  ): Promise<void>;
  parseIncomingConfirmCheckoutSessionRequest(
    request: NextApiRequest,
    mapper: IMapper,
  ): Promise<IConfirmPaymentIntentRequest | null>;
}

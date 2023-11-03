export interface IPaypalPrice {
  currency_code: string;
  value: number;
}

export interface IPaypalPurchaseUnitAmountBreakdown {
  item_total: IPaypalPrice;
}

export interface IPaypalPurchaseUnitAmount extends IPaypalPrice {
  breakdown: IPaypalPurchaseUnitAmountBreakdown;
}

export interface IPaypalPurchaseUnitApplicationContext {
  brand_name: string;
  locale: string;
  shipping_preference: string;
}

export interface IPaypalPurchaseUnitItem {
  name: string;
  quantity: number;
  description: string;
  sku: string;
  category: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS' | 'DONATION';
  unit_amount: IPaypalPrice;
}

export interface IPaypalName {
  full_name: string;
}

export interface IPaypalAddress {
  address_line_1: string;
  address_line_2: string;
  admin_area_2: string;
  admin_area_1: string;
  country_code: string;
  postal_code: string;
}

export interface IPaypalPurchaseUnitShipping {
  name: IPaypalName;
  address: IPaypalAddress;
}

export interface IPaypalPurchaseUnit {
  invoice_id: string;
  application_context: IPaypalPurchaseUnitApplicationContext;
  amount: IPaypalPurchaseUnitAmount;
  items: IPaypalPurchaseUnitItem[];
  shipping: IPaypalPurchaseUnitShipping;
}

export interface IPaypalCreateOrderRequest {
  intent: 'CAPTURE' | 'AUTHORIZE';
  purchase_units: IPaypalPurchaseUnit[];
}

export interface IPaypalConfirmOrderPurchaseUnit {
  invoice_id: string;
}

export interface IPaypalConfirmOrderRequest {
  id: string;
  purchase_units: IPaypalConfirmOrderPurchaseUnit[];
}

export interface IPaypalConfirmCheckoutSessionRequest {
  orderID: { orderID: string };
}

import { IdModel } from '../interfaces';
import { CountryCode, PaymentIntentMode, PaymentMethodType } from './shared';

export interface IStripeAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface IStripeProductData {
  name: string;
  description: string;
  images: string[];
  metadata: IdModel;
}

export interface IStripePriceData {
  currency: string;
  unit_amount: number;
  product?: string;
  product_data?: IStripeProductData;
}

export interface IStripeLineItem {
  quantity: number;
  price_data: IStripePriceData;
}

export interface IStripeShippingAddressCollection {
  allowed_countries: CountryCode[];
}

export interface IStripeMetadata {
  [name: string]: string | number | null;
}

export interface IStripeCheckoutSessionCreateRequest {
  payment_method_types: PaymentMethodType[];
  shipping_address_collection: IStripeShippingAddressCollection;
  customer_email: string;
  line_items: IStripeLineItem[];
  mode?: PaymentIntentMode;
  success_url: string;
  cancel_url: string;
  metadata: IStripeMetadata;
}

export interface IStripeShippingDetails {
  address: IStripeAddress;
  name: string;
}

export interface IStripeConfirmPaymentIntentRequest {
  type: string;
  data: {
    object: {
      id: string;
      shipping_details: IStripeShippingDetails;
      metadata: IStripeMetadata;
      payment_status: string;
    };
  };
}

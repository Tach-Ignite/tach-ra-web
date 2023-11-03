import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import {
  IAddress,
  IConfirmPaymentIntentRequest,
  ICreatePaymentIntentRequest,
  ILineItem,
  IPriceData,
  IProductData,
  IShippingDetails,
  IShippingInformation,
} from '@/lib/abstractions';

export const iProductDataMetadata = {
  name: String,
  description: String,
  imageUrls: [String],
};

export const iPriceDataMetadata = {
  currency: String,
  unitAmount: Number,
  productData: 'IProductData',
};

export const iLineItemMetadata = {
  quantity: Number,
  priceData: 'IPriceData',
};

export const iShippingInformationMetadata = {
  address: 'IAddress',
};

export const iCreatePaymentIntentRequestMetadata = {
  paymentMethodTypes: [String],
  shippingInformation: 'IShippingInformation',
  customerEmail: String,
  lineItems: ['ILineItem'],
  mode: String,
  successUrl: String,
  cancelUrl: String,
  orderId: String,
};

export const iAddressMetadata = {
  lineOne: String,
  lineTwo: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
};

export const iShippingDetailsMetadata = {
  address: 'IAddress',
};

export const iConfirmPaymentIntentRequestMetadata = {
  orderId: String,
  checkoutSessionId: String,
  paymentStatus: String,
  paymentProvider: String,
};

export function createPaymentMetadata() {
  PojosMetadataMap.create<IProductData>('IProductData', {
    name: String,
    description: String,
    imageUrls: [String],
  });

  PojosMetadataMap.create<IPriceData>('IPriceData', iPriceDataMetadata);

  PojosMetadataMap.create<ILineItem>('ILineItem', iLineItemMetadata);

  PojosMetadataMap.create<IShippingInformation>('IShippingInformation', {
    address: 'IAddress',
  });

  PojosMetadataMap.create<ICreatePaymentIntentRequest>(
    'ICreatePaymentIntentRequest',
    {
      paymentMethodTypes: [String],
      shippingInformation: 'IShippingInformation',
      customerEmail: String,
      lineItems: ['ILineItem'],
      mode: String,
      successUrl: String,
      cancelUrl: String,
      orderId: String,
    },
  );

  PojosMetadataMap.create<IAddress>('IAddress', iAddressMetadata);

  PojosMetadataMap.create<IShippingDetails>(
    'IShippingDetails',
    iShippingDetailsMetadata,
  );

  PojosMetadataMap.create<IConfirmPaymentIntentRequest>(
    'IConfirmPaymentIntentRequest',
    iConfirmPaymentIntentRequestMetadata,
  );
}

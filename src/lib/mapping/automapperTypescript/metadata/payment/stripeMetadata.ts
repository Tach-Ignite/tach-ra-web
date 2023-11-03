import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import {
  IStripeAddress,
  IStripeCheckoutSessionCreateRequest,
  IStripeConfirmPaymentIntentRequest,
  IStripeLineItem,
  IStripeMetadata,
  IStripePriceData,
  IStripeProductData,
  IStripeShippingAddressCollection,
} from '@/lib/abstractions';

export function createStripePaymentMetadata() {
  PojosMetadataMap.create<IStripeAddress>('IStripeAddress', {
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    postal_code: String,
  });

  PojosMetadataMap.create<IStripeProductData>('IStripeProductData', {
    name: String,
    description: String,
    images: [String],
    metadata: 'IdModel',
  });

  PojosMetadataMap.create<IStripePriceData>('IStripePriceData', {
    currency: String,
    unit_amount: Number,
    product: String,
    product_data: 'IStripeProductData',
  });

  PojosMetadataMap.create<IStripeLineItem>('IStripeLineItem', {
    quantity: Number,
    price_data: 'IStripePriceData',
  });

  PojosMetadataMap.create<IStripeShippingAddressCollection>(
    'IStripeShippingAddressCollection',
    {
      allowed_countries: [String],
    },
  );

  PojosMetadataMap.create<IStripeMetadata>('IStripeMetadata', {
    orderId: String,
    email: String,
    images: String,
  });

  PojosMetadataMap.create<IStripeCheckoutSessionCreateRequest>(
    'IStripeCheckoutSessionCreateRequest',
    {
      payment_method_types: [String],
      shipping_address_collection: 'IStripeShippingAddressCollection',
      customer_email: String,
      line_items: ['IStripeLineItem'],
      mode: String,
      success_url: String,
      cancel_url: String,
      metadata: 'IStripeMetadata',
    },
  );

  PojosMetadataMap.create('IStripeConfirmPaymentIntentRequestDataObject', {
    id: String,
    shipping_details: 'IStripeShippingDetails',
    metadata: 'IStripeMetadata',
    payment_status: String,
  });

  PojosMetadataMap.create('IStripeConfirmPaymentIntentRequestData', {
    object: 'IStripeConfirmPaymentIntentRequestDataObject',
  });

  PojosMetadataMap.create<IStripeConfirmPaymentIntentRequest>(
    'IStripeConfirmPaymentIntentRequest',
    {
      data: 'IStripeConfirmPaymentIntentRequestData',
    },
  );
}

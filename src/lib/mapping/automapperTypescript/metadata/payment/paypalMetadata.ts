import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import {
  IPaypalAddress,
  IPaypalCreateOrderRequest,
  IPaypalName,
  IPaypalPrice,
  IPaypalPurchaseUnit,
  IPaypalPurchaseUnitAmount,
  IPaypalPurchaseUnitAmountBreakdown,
  IPaypalPurchaseUnitItem,
  IPaypalPurchaseUnitShipping,
} from '@/lib/abstractions';

export function createPaypalPaymentMetadata() {
  PojosMetadataMap.create<IPaypalPrice>('IPaypalPrice', {
    currency_code: String,
    value: Number,
  });

  PojosMetadataMap.create<IPaypalPurchaseUnitAmountBreakdown>(
    'IPaypalPurchaseUnitAmountBreakdown',
    {
      item_total: 'IPaypalPrice',
    },
  );

  PojosMetadataMap.create<IPaypalPurchaseUnitAmount>(
    'IPaypalPurchaseUnitAmount',
    {
      currency_code: String,
      value: Number,
      breakdown: 'IPaypalPurchaseUnitAmountBreakdown',
    },
  );

  PojosMetadataMap.create<IPaypalPurchaseUnitItem>('IPaypalPurchaseUnitItem', {
    name: String,
    quantity: Number,
    description: String,
    sku: String,
    category: String,
    unit_amount: 'IPaypalPrice',
  });

  PojosMetadataMap.create<IPaypalName>('IPaypalName', {
    full_name: String,
  });

  PojosMetadataMap.create<IPaypalAddress>('IPaypalAddress', {
    address_line_1: String,
    address_line_2: String,
    admin_area_2: String,
    admin_area_1: String,
    country_code: String,
    postal_code: String,
  });

  PojosMetadataMap.create<IPaypalPurchaseUnitShipping>(
    'IPaypalPurchaseUnitShipping',
    {
      name: 'IPaypalName',
      address: 'IPaypalAddress',
    },
  );

  PojosMetadataMap.create<IPaypalPurchaseUnit>('IPaypalPurchaseUnit', {
    invoice_id: String,
    application_context: 'IPaypalPurchaseUnitApplicationContext',
    amount: 'IPaypalPurchaseUnitAmount',
    items: ['IPaypalPurchaseUnitItem'],
    shipping: 'IPaypalPurchaseUnitShipping',
  });

  PojosMetadataMap.create<IPaypalCreateOrderRequest>(
    'IPaypalCreateOrderRequest',
    {
      intent: String,
      purchase_units: ['IPaypalPurchaseUnit'],
    },
  );
}

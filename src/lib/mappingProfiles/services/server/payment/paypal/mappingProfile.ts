import {
  CamelCaseNamingConvention,
  Mapper,
  MappingProfile,
  SnakeCaseNamingConvention,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
  namingConventions,
} from '@jersmart/automapper-core';
import {
  IAddress,
  IConfirmPaymentIntentRequest,
  ICreatePaymentIntentRequest,
  ILineItem,
  IPaypalAddress,
  IPaypalConfirmOrderRequest,
  IPaypalCreateOrderRequest,
  IPaypalPrice,
  IPaypalPurchaseUnit,
  IPaypalPurchaseUnitItem,
  IPaypalPurchaseUnitShipping,
  IPriceData,
  IShippingInformation,
  ITachMappingProfile,
} from '@/lib/abstractions';
import { PaymentStatusEnum } from '@/lib/enums';
import { TachMappingProfileClass } from '@/lib/mapping';

@TachMappingProfileClass(
  'lib/services/server/payment/paypal/mappingProfile',
  namingConventions({
    source: new CamelCaseNamingConvention(),
    destination: new SnakeCaseNamingConvention(),
  }),
)
export class PaypalPaymentServiceMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IPriceData, IPaypalPrice>(
        mapper,
        'IPriceData',
        'IPaypalPrice',
        forMember(
          (d) => d.currency_code,
          mapFrom((s) => s.currency),
        ),
        forMember(
          (d) => d.value,
          mapFrom((s) => s.unitAmount),
        ),
        namingConventions({
          source: new CamelCaseNamingConvention(),
          destination: new SnakeCaseNamingConvention(),
        }),
      );
      createMap<IAddress, IPaypalAddress>(
        mapper,
        'IAddress',
        'IPaypalAddress',
        forMember(
          (d) => d.address_line_1,
          mapFrom((s) => s.lineOne),
        ),
        forMember(
          (d) => d.address_line_2,
          mapFrom((s) => s.lineTwo),
        ),
        forMember(
          (d) => d.admin_area_2,
          mapFrom((s) => s.city),
        ),
        forMember(
          (d) => d.admin_area_1,
          mapFrom((s) => s.state),
        ),
        forMember(
          (d) => d.country_code,
          mapFrom((s) => s.country),
        ),
      );
      createMap<IShippingInformation, IPaypalPurchaseUnitShipping>(
        mapper,
        'IShippingInformation',
        'IPaypalPurchaseUnitShipping',
        forMember(
          (d) => d.name,
          mapFrom((s) => ({
            full_name: s.recipientName,
          })),
        ),
        forMember(
          (d) => d.address,
          mapFrom((s) =>
            mapper.map<IAddress, IPaypalAddress>(
              s.address,
              'IAddress',
              'IPaypalAddress',
            ),
          ),
        ),
      );
      createMap<ILineItem, IPaypalPurchaseUnitItem>(
        mapper,
        'ILineItem',
        'IPaypalPurchaseUnitItem',
        forMember(
          (d) => d.name,
          mapFrom((s) => s.priceData.productData.name),
        ),
        forMember(
          (d) => d.description,
          mapFrom((s) => s.priceData.productData.description.slice(0, 127)),
        ),
        forMember(
          (d) => d.sku,
          mapFrom((s) => s.priceData.productData._id),
        ),
        forMember(
          (d) => d.category,
          mapFrom((s) => 'DIGITAL_GOODS'),
        ),
        forMember(
          (d) => d.unit_amount,
          mapFrom((s) =>
            mapper.map<IPriceData, IPaypalPrice>(
              s.priceData,
              'IPriceData',
              'IPaypalPrice',
            ),
          ),
        ),
      );
      createMap<ICreatePaymentIntentRequest, IPaypalPurchaseUnit>(
        mapper,
        'ICreatePaymentIntentRequest',
        'IPaypalPurchaseUnit',
        forMember(
          (d) => d.invoice_id,
          mapFrom((s) => s.orderId),
        ),
        forMember(
          (d) => d.application_context,
          mapFrom((s) => ({
            brand_name: 'TachStore',
            locale: 'en-US',
            shipping_preference: 'SET_PROVIDED_ADDRESS',
          })),
        ),
        forMember(
          (d) => d.amount,
          mapFrom((s) => {
            const total = s.lineItems
              .map((item) => item.priceData.unitAmount * item.quantity)
              .reduce((a, b) => a + b, 0);
            const currency_code =
              s.lineItems && s.lineItems.length > 0
                ? s.lineItems[0].priceData.currency
                : 'USD';
            return {
              currency_code,
              value: total,
              breakdown: {
                item_total: {
                  currency_code,
                  value: total,
                },
              },
            };
          }),
        ),
        forMember(
          (d) => d.items,
          mapFrom((s) =>
            s.lineItems.map((item) =>
              mapper.map<ILineItem, IPaypalPurchaseUnitItem>(
                item,
                'ILineItem',
                'IPaypalPurchaseUnitItem',
              ),
            ),
          ),
        ),
        forMember(
          (d) => d.shipping,
          mapFrom((s) =>
            mapper.map<IShippingInformation, IPaypalPurchaseUnitShipping>(
              s.shippingInformation,
              'IShippingInformation',
              'IPaypalPurchaseUnitShipping',
            ),
          ),
        ),
      );
      createMap<ICreatePaymentIntentRequest, IPaypalCreateOrderRequest>(
        mapper,
        'ICreatePaymentIntentRequest',
        'IPaypalCreateOrderRequest',
        forMember(
          (d) => d.intent,
          mapFrom((s) => 'CAPTURE'),
        ),
        forMember(
          (d) => d.purchase_units,
          mapFrom((s) => [
            mapper.map<ICreatePaymentIntentRequest, IPaypalPurchaseUnit>(
              s,
              'ICreatePaymentIntentRequest',
              'IPaypalPurchaseUnit',
            ),
          ]),
        ),
      );
      createMap<IPaypalConfirmOrderRequest, IConfirmPaymentIntentRequest>(
        mapper,
        'IPaypalConfirmOrderRequest',
        'IConfirmPaymentIntentRequest',
        forMember(
          (d) => d.orderId,
          mapFrom((s) =>
            s.purchase_units && s.purchase_units.length > 0
              ? s.purchase_units[0].invoice_id
              : null,
          ),
        ),
        forMember(
          (d) => d.checkoutSessionId,
          mapFrom((s) => s.id),
        ),
        forMember(
          (d) => d.paymentStatus,
          mapFrom((s) =>
            PaymentStatusEnum.reverseLookup(PaymentStatusEnum.Paid),
          ),
        ),
        forMember(
          (d) => d.paymentProvider,
          mapWithArguments((s, { paymentProvider }) => paymentProvider),
        ),
      );
    };
  }
}

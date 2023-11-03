import {
  CamelCaseNamingConvention,
  Mapper,
  MappingProfile,
  SnakeCaseNamingConvention,
  beforeMap,
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
  IPriceData,
  IProductData,
  IShippingInformation,
  IStripeAddress,
  IStripeCheckoutSessionCreateRequest,
  IStripeConfirmPaymentIntentRequest,
  IStripeLineItem,
  IStripePriceData,
  IStripeProductData,
  IStripeShippingAddressCollection,
  ITachMappingProfile,
} from '@/lib/abstractions';
import { TachMappingProfileClass } from '@/lib/mapping';
import { PaymentStatusEnum } from '@/lib/enums';
import { ErrorWithStatusCode } from '@/lib/errors';

@TachMappingProfileClass(
  'lib/services/server/payment/stripe/mappingProfile',
  namingConventions({
    source: new CamelCaseNamingConvention(),
    destination: new SnakeCaseNamingConvention(),
  }),
)
export class StripePaymentServiceMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IProductData, IStripeProductData>(
        mapper,
        'IProductData',
        'IStripeProductData',
        forMember(
          (d) => d.images,
          mapFrom((s) => s.imageUrls),
        ),
        forMember(
          (d) => d.metadata,
          mapFrom((s) => ({ _id: s._id })),
        ),
      );
      createMap<IPriceData, IStripePriceData>(
        mapper,
        'IPriceData',
        'IStripePriceData',
        forMember(
          (d) => d.unit_amount,
          mapFrom((s) => s.unitAmount * 100),
        ),
      );
      createMap<ILineItem, IStripeLineItem>(
        mapper,
        'ILineItem',
        'IStripeLineItem',
      );
      createMap<IShippingInformation, IStripeShippingAddressCollection>(
        mapper,
        'IShippingInformation',
        'IStripeShippingAddressCollection',
      );
      createMap<
        ICreatePaymentIntentRequest,
        IStripeCheckoutSessionCreateRequest
      >(
        mapper,
        'ICreatePaymentIntentRequest',
        'IStripeCheckoutSessionCreateRequest',
        forMember(
          (d) => d.shipping_address_collection,
          mapFrom((s) =>
            mapper.map<IShippingInformation, IStripeShippingAddressCollection>(
              s.shippingInformation,
              'IShippingInformation',
              'IStripeShippingAddressCollection',
            ),
          ),
        ),
        forMember(
          (d) => d.metadata,
          mapFrom((s) => ({
            orderId: s.orderId,
            email: s.customerEmail,
            images: JSON.stringify(
              s.lineItems.map(
                (item: ILineItem) => item.priceData.productData.imageUrls,
              ),
            ),
          })),
        ),
      );
      createMap<IAddress, IStripeAddress>(
        mapper,
        'IAddress',
        'IStripeAddress',
        forMember(
          (d) => d.line1,
          mapFrom((s) => s.lineOne),
        ),
        forMember(
          (d) => d.line2,
          mapFrom((s) => s.lineTwo),
        ),
      );
      createMap<
        IStripeConfirmPaymentIntentRequest,
        IConfirmPaymentIntentRequest
      >(
        mapper,
        'IStripeConfirmPaymentIntentRequest',
        'IConfirmPaymentIntentRequest',
        namingConventions({
          source: new SnakeCaseNamingConvention(),
          destination: new CamelCaseNamingConvention(),
        }),
        beforeMap((s, d, extraArgs) => {
          if (
            extraArgs &&
            extraArgs.stripe &&
            extraArgs.signature &&
            extraArgs.rawBody &&
            extraArgs.stripeWebhookSecret
          ) {
            s = extraArgs!.stripe.webhooks.constructEvent(
              extraArgs.rawBody,
              extraArgs!.signature!,
              extraArgs.stripeWebhookSecret,
            );
          }
          return s;
        }),
        forMember(
          (d) => d.paymentStatus,
          mapFrom((s) => {
            switch (s.data.object.payment_status) {
              case 'paid':
                return PaymentStatusEnum.reverseLookup(PaymentStatusEnum.Paid);
              case 'unpaid':
                return PaymentStatusEnum.reverseLookup(
                  PaymentStatusEnum.Unpaid,
                );
              case 'refunded':
                return PaymentStatusEnum.reverseLookup(
                  PaymentStatusEnum.Refunded,
                );
              default:
                throw new ErrorWithStatusCode(
                  `Payment status ${s.data.object.payment_status} is not supported.`,
                  500,
                  'Internal Server Error',
                );
            }
          }),
        ),
        forMember(
          (d) => d.checkoutSessionId,
          mapFrom((s) => s.data.object.id),
        ),
        forMember(
          (d) => d.orderId,
          mapFrom((s) => s.data.object.metadata.orderId),
        ),
        forMember(
          (d) => d.paymentProvider,
          mapWithArguments((s, { paymentProvider }) => paymentProvider),
        ),
      );
    };
  }
}

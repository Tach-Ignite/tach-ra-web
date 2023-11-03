import { NextApiRequest } from 'next';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import {
  ConfirmCheckoutSessionCommandPayload,
  CreatePaymentIntentCommandPayload,
  IConfirmPaymentIntentRequest,
  ICreatePaymentIntentRequest,
  ILineItem,
  IPriceData,
  ITachMappingProfile,
  ParseConfirmCheckoutSessionCommandPayload,
} from '@/lib/abstractions';
import {
  CartItemViewModel,
  CheckoutViewModel,
  CreateOrderCommandPayload,
  IOrder,
  IUserAddress,
  OrderStatusEnum,
  ProductViewModel,
  UpdateOrderPaymentStatusCommandPayload,
  UserAddressViewModel,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import { PaymentStatusEnum } from '@/lib/enums';
import '../addresses/currentUser/mappingProfile';

@TachMappingProfileClass('pages/api/checkout/mappingProfile')
export class CheckoutApiMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<ProductViewModel, IPriceData>(
        mapper,
        'ProductViewModel',
        'IPriceData',
        forMember(
          (d) => d.currency,
          mapFrom((s) => 'usd'),
        ),
        forMember(
          (d) => d.unitAmount,
          mapFrom((s) => s.price),
        ),
        forMember(
          (d) => d.productData,
          mapFrom((s) => ({
            _id: s._id,
            name: s.name,
            description: s.description,
            imageUrls: s.imageUrls,
          })),
        ),
      );
      createMap<CartItemViewModel, ILineItem>(
        mapper,
        'CartItemViewModel',
        'ILineItem',
        forMember(
          (d) => d.priceData,
          mapFrom((s) =>
            mapper.map<ProductViewModel, IPriceData>(
              s.product,
              'ProductViewModel',
              'IPriceData',
            ),
          ),
        ),
      );
      createMap<UserAddressViewModel, IUserAddress>(
        mapper,
        'UserAddressViewModel',
        'IUserAddress',
        forMemberId,
      );
      createMap<CheckoutViewModel, IOrder>(
        mapper,
        'CheckoutViewModel',
        'IOrder',
        forMember(
          (d) => d.user,
          mapWithArguments((s, { user }) => user),
        ),
        forMember(
          (d) => d.lineItems,
          mapFrom((s) =>
            mapper.mapArray<CartItemViewModel, ILineItem>(
              s.cart,
              'CartItemViewModel',
              'ILineItem',
            ),
          ),
        ),
        forMember(
          (d) => d.orderStatus,
          mapFrom((s) =>
            OrderStatusEnum.reverseLookup(OrderStatusEnum.Created),
          ),
        ),
        forMember(
          (d) => d.paymentStatus,
          mapFrom((s) =>
            PaymentStatusEnum.reverseLookup(PaymentStatusEnum.Unpaid),
          ),
        ),
      );
      createMap<CheckoutViewModel, CreateOrderCommandPayload>(
        mapper,
        'CheckoutViewModel',
        'CreateOrderCommandPayload',
        forMember(
          (d) => d.order,
          mapWithArguments((s, { user }) =>
            mapper.map<CheckoutViewModel, IOrder>(
              s,
              'CheckoutViewModel',
              'IOrder',
              { extraArgs: () => ({ user }) },
            ),
          ),
        ),
      );
      createMap<IOrder, ICreatePaymentIntentRequest>(
        mapper,
        'IOrder',
        'ICreatePaymentIntentRequest',
        forMember(
          (d) => d.paymentMethodTypes,
          mapFrom((s) => ['card']),
        ),
        forMember(
          (d) => d.shippingInformation,
          mapFrom((s) => ({
            address: s.userAddress.address,
            recipientName: s.userAddress.recipientName,
          })),
        ),
        forMember(
          (d) => d.customerEmail,
          mapWithArguments((s, { email }) => email),
        ),
        forMember(
          (d) => d.mode,
          mapFrom((s) => 'payment'),
        ),
        forMember(
          (d) => d.successUrl,
          mapFrom(
            (s) => `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          ),
        ),
        forMember(
          (d) => d.cancelUrl,
          mapFrom((s) => `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`),
        ),
        forMember(
          (d) => d.orderId,
          mapFrom((s) => s._id),
        ),
      );
      createMap<IOrder, CreatePaymentIntentCommandPayload>(
        mapper,
        'IOrder',
        'CreatePaymentIntentCommandPayload',
        forMember(
          (d) => d.createPaymentIntentRequest,
          mapWithArguments((s, { email }) =>
            mapper.map<IOrder, ICreatePaymentIntentRequest>(
              s,
              'IOrder',
              'ICreatePaymentIntentRequest',
              { extraArgs: () => ({ email }) },
            ),
          ),
        ),
      );
      createMap<NextApiRequest, ParseConfirmCheckoutSessionCommandPayload>(
        mapper,
        'NextApiRequest',
        'ParseConfirmCheckoutSessionCommandPayload',
        forMember(
          (d) => d.request,
          mapFrom((s) => s),
        ),
      );
      createMap<
        IConfirmPaymentIntentRequest,
        UpdateOrderPaymentStatusCommandPayload
      >(
        mapper,
        'IConfirmPaymentIntentRequest',
        'UpdateOrderPaymentStatusCommandPayload',
      );
      createMap<
        IConfirmPaymentIntentRequest,
        ConfirmCheckoutSessionCommandPayload
      >(
        mapper,
        'IConfirmPaymentIntentRequest',
        'ConfirmCheckoutSessionCommandPayload',
        forMember(
          (d) => d.confirmPaymentIntentRequest,
          mapFrom((s) => s),
        ),
      );
    };
  }
}

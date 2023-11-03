import {
  IStripeConfirmPaymentIntentRequest,
  IStripeMetadata,
  IStripeShippingDetails,
} from '@/lib/abstractions';

export function isIStripeShippingDetails(
  shippingDetails: any,
): shippingDetails is IStripeShippingDetails {
  return (
    shippingDetails &&
    shippingDetails.address &&
    shippingDetails.address.line1 &&
    shippingDetails.address.line2 &&
    shippingDetails.address.city &&
    shippingDetails.address.state &&
    shippingDetails.address.country &&
    shippingDetails.address.postal_code &&
    shippingDetails.name
  );
}

export function isIStripeMetadata(metadata: any): metadata is IStripeMetadata {
  return metadata && metadata.orderId && metadata.email && metadata.images;
}

export function isIStripeConfirmPaymentIntentRequest(
  request: any,
): request is IStripeConfirmPaymentIntentRequest {
  return (
    request &&
    request.event &&
    request.event.data &&
    request.event.data.object &&
    request.event.data.object.shipping_details &&
    isIStripeShippingDetails(request.event.data.object.shipping_details) &&
    request.event.data.object.metadata &&
    isIStripeMetadata(request.event.data.object.metadata) &&
    request.event.data.object.payment_status
  );
}

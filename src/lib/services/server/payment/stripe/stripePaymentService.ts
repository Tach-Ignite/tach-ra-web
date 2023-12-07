import Stripe from 'stripe';
import { NextApiRequest } from 'next';
import {
  IAsyncMultiProvider,
  IConfirmPaymentIntentRequest,
  ICreateCheckoutSessionResponse,
  ICreatePaymentIntentRequest,
  IFactory,
  IFormParser,
  IMapper,
  IPaymentService,
  IStripeCheckoutSessionCreateRequest,
  IStripeConfirmPaymentIntentRequest,
} from '@/lib/abstractions';
import '@/lib/mappingProfiles/services/server/payment/stripe/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'stripePaymentService',
  'formParser',
  'stripeClientFactory',
  'secretsProviderFactory',
)
export class StripePaymentService implements IPaymentService {
  private _stripeClientFactory: IFactory<Promise<Stripe>>;

  private _formParser: IFormParser;

  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    formParser: IFormParser,
    stripeClientFactory: IFactory<Promise<Stripe>>,
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._formParser = formParser;
    this._stripeClientFactory = stripeClientFactory;
    this._secretsProvider = secretsProviderFactory.create();
  }

  async createCheckoutSession(
    request: ICreatePaymentIntentRequest,
    mapper: IMapper,
  ): Promise<ICreateCheckoutSessionResponse> {
    const sessionCreateRequest = mapper.map<
      ICreatePaymentIntentRequest,
      IStripeCheckoutSessionCreateRequest
    >(
      request,
      'ICreatePaymentIntentRequest',
      'IStripeCheckoutSessionCreateRequest',
    );

    const stripe = await this._stripeClientFactory.create();
    const session = await stripe.checkout.sessions.create(sessionCreateRequest);

    return {
      checkoutSessionId: session.id,
      checkoutSessionUrl: session.url,
    };
  }

  async confirmCheckoutSession(request: any): Promise<void> {
    // This needs no implementation.
  }

  async parseIncomingConfirmCheckoutSessionRequest(
    request: NextApiRequest,
    mapper: IMapper,
  ): Promise<IConfirmPaymentIntentRequest | null> {
    const body =
      await this._formParser.parseJsonForm<IStripeConfirmPaymentIntentRequest>(
        request,
      );

    if (body.type !== 'checkout.session.completed') {
      return null;
    }

    const webhookSecret = (await this._secretsProvider.provide(
      'TACH_STRIPE_WEBHOOK_SIGNATURE',
    ))!;
    const stripe = await this._stripeClientFactory.create();
    return mapper.map<
      IStripeConfirmPaymentIntentRequest,
      IConfirmPaymentIntentRequest
    >(
      body,
      'IStripeConfirmPaymentIntentRequest',
      'IConfirmPaymentIntentRequest',
      {
        extraArgs:
          process.env.NODE_ENV === 'production'
            ? () => ({
                stripe,
                signature: request.headers['stripe-signature'],
                rawBody: body,
                paymentProvider: 'stripe',
                stripeWebhookSecret: webhookSecret,
              })
            : () => ({ paymentProvider: 'stripe' }),
      },
    );
  }
}

import { NextApiRequest } from 'next';
import {
  IAsyncMultiProvider,
  IConfirmPaymentIntentRequest,
  ICreatePaymentIntentRequest,
  IFactory,
  IFormParser,
  IMapper,
  IPaymentService,
  IPaypalConfirmCheckoutSessionRequest,
  IPaypalConfirmOrderRequest,
  IPaypalCreateOrderRequest,
} from '@/lib/abstractions';
import '@/lib/mappingProfiles/services/server/payment/paypal/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('payPalPaymentService', 'formParser', 'secretsProviderFactory')
export class PayPalPaymentService implements IPaymentService {
  private _baseURL = {
    sandbox: 'https://api-m.sandbox.paypal.com',
    production: 'https://api-m.paypal.com',
  };

  private _formParser: IFormParser;

  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    formParser: IFormParser,
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._formParser = formParser;

    this._secretsProvider = secretsProviderFactory.create();
  }

  async createCheckoutSession(
    request: ICreatePaymentIntentRequest,
    mapper: IMapper,
  ): Promise<string> {
    const accessToken = await this.generateAccessToken();
    const url = `${this._baseURL.sandbox}/v2/checkout/orders`;

    const paypalRequest = mapper.map<
      ICreatePaymentIntentRequest,
      IPaypalCreateOrderRequest
    >(request, 'ICreatePaymentIntentRequest', 'IPaypalCreateOrderRequest');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paypalRequest),
    });
    const data = await response.json();
    return data.id;
  }

  async confirmCheckoutSession(
    request: IConfirmPaymentIntentRequest,
  ): Promise<void> {
    const accessToken = await this.generateAccessToken();
    const url = `${this._baseURL.sandbox}/v2/checkout/orders/${request.checkoutSessionId}/capture`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    return data;
  }

  async parseIncomingConfirmCheckoutSessionRequest(
    request: NextApiRequest,
    mapper: IMapper,
  ): Promise<IConfirmPaymentIntentRequest | null> {
    const body =
      await this._formParser.parseJsonForm<IPaypalConfirmCheckoutSessionRequest>(
        request,
      );

    const accessToken = await this.generateAccessToken();
    const url = `${this._baseURL.sandbox}/v2/checkout/orders/${body.orderID.orderID}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    const result = mapper.map<
      IPaypalConfirmOrderRequest,
      IConfirmPaymentIntentRequest
    >(data, 'IPaypalConfirmOrderRequest', 'IConfirmPaymentIntentRequest', {
      extraArgs: () => ({ paymentProvider: 'paypal' }),
    });
    return result;
  }

  private async generateAccessToken() {
    const paypalSecretKey = (await this._secretsProvider.provide(
      'TACH_PAYPAL_SECRET_KEY',
    ))!;
    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${paypalSecretKey}`,
    ).toString('base64');
    const response = await fetch(`${this._baseURL.sandbox}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();
    return data.access_token;
  }
}

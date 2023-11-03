import { IAsyncMultiProvider, IFactory } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';
import Stripe from 'stripe';

@Injectable('stripeClientFactory', 'secretsProviderFactory')
export class StripeClientFactory implements IFactory<Promise<Stripe>> {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._secretsProvider = secretsProviderFactory.create();
  }

  async create(): Promise<Stripe> {
    const stripeSecretKey = await this._secretsProvider.provide(
      'TACH_STRIPE_SECRET_KEY',
    );

    const stripeInstance = new Stripe(stripeSecretKey!, {
      apiVersion: '2022-11-15',
    });

    return stripeInstance;
  }
}

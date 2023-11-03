import {
  IFactory,
  IMapper,
  IPaymentService,
  IProvider,
  ConfirmCheckoutSessionCommandPayload,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { Command } from '../../command';

@Injectable(
  'confirmCheckoutSessionCommand',
  'paymentServiceFactory',
  'automapperProvider',
  'payload',
)
export class ConfirmCheckoutSessionCommand extends Command<
  ConfirmCheckoutSessionCommandPayload,
  any
> {
  private _paymentServiceFactory: IFactory<IPaymentService>;

  private _automapperProvider: IProvider<IMapper>;

  constructor(
    paymentServiceFactory: IFactory<IPaymentService>,
    automapperProvider: IProvider<IMapper>,
    payload: ConfirmCheckoutSessionCommandPayload,
  ) {
    super(payload);
    this._paymentServiceFactory = paymentServiceFactory;
    this._automapperProvider = automapperProvider;
  }

  async execute(): Promise<void> {
    const mapper = this._automapperProvider.provide();
    const paymentService = this._paymentServiceFactory.create();
    this.result = await paymentService.confirmCheckoutSession(
      this._payload.confirmPaymentIntentRequest,
      mapper,
    );
  }
}

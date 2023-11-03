import {
  IFactory,
  IMapper,
  IPaymentService,
  IProvider,
  CreatePaymentIntentCommandPayload,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { Command } from '../../command';

@Injectable(
  'createPaymentIntentCommand',
  'paymentServiceFactory',
  'automapperProvider',
  'payload',
)
export class CreatePaymentIntentCommand extends Command<
  CreatePaymentIntentCommandPayload,
  string
> {
  private _paymentServiceFactory: IFactory<IPaymentService>;

  private _automapperProvider: IProvider<IMapper>;

  constructor(
    paymentServiceFactory: IFactory<IPaymentService>,
    automapperProvider: IProvider<IMapper>,
    payload: CreatePaymentIntentCommandPayload,
  ) {
    super(payload);
    this._paymentServiceFactory = paymentServiceFactory;
    this._automapperProvider = automapperProvider;
  }

  async execute(): Promise<void> {
    const mapper = this._automapperProvider.provide();
    const paymentService = this._paymentServiceFactory.create();
    this.result = await paymentService.createCheckoutSession(
      this._payload.createPaymentIntentRequest,
      mapper,
    );
  }
}

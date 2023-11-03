import {
  IConfirmPaymentIntentRequest,
  IFactory,
  IMapper,
  IPaymentService,
  IProvider,
} from '@/lib/abstractions';
import { ParseConfirmCheckoutSessionCommandPayload } from '@/lib/abstractions/commands/payloads/parseConfirmCheckoutSessionRequestCommandPayload';
import { Injectable } from '@/lib/ioc/injectable';
import { Command } from '../../command';

@Injectable(
  'parseConfirmCheckoutSessionCommand',
  'paymentServiceFactory',
  'automapperProvider',
  'payload',
)
export class ParseConfirmCheckoutSessionCommand extends Command<
  ParseConfirmCheckoutSessionCommandPayload,
  IConfirmPaymentIntentRequest
> {
  private _paymentServiceFactory: IFactory<IPaymentService>;

  private _automapperProvider: IProvider<IMapper>;

  constructor(
    paymentServiceFactory: IFactory<IPaymentService>,
    automapperProvider: IProvider<IMapper>,
    payload: ParseConfirmCheckoutSessionCommandPayload,
  ) {
    super(payload);
    this._paymentServiceFactory = paymentServiceFactory;
    this._automapperProvider = automapperProvider;
  }

  async execute(): Promise<void> {
    const mapper = this._automapperProvider.provide();
    const paymentService = this._paymentServiceFactory.create();
    const serviceResult =
      await paymentService.parseIncomingConfirmCheckoutSessionRequest(
        this._payload.request,
        mapper,
      );
    this.result = serviceResult || undefined;
  }
}

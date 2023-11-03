import {
  IFactory,
  IOptions,
  IPaymentService,
  IPaymentConfiguration,
  IServiceResolver,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'paymentServiceFactory',
  'serviceResolver',
  'paymentConfigurationOptions',
)
export class PaymentServiceFactory implements IFactory<IPaymentService> {
  private _serviceResolver: IServiceResolver;

  private _config: IPaymentConfiguration;

  constructor(
    serviceResolver: IServiceResolver,
    paymentConfigurationOptions: IOptions<IPaymentConfiguration>,
  ) {
    this._serviceResolver = serviceResolver;
    this._config = paymentConfigurationOptions.value;
  }

  create(): IPaymentService {
    switch (this._config.provider) {
      case 'stripe':
        return this._serviceResolver.resolve<IPaymentService>(
          'stripePaymentService',
        );
      case 'paypal':
        return this._serviceResolver.resolve<IPaymentService>(
          'payPalPaymentService',
        );
      default:
        throw new Error(
          `Payment provider ${this._config.provider} is not supported.`,
        );
    }
  }
}

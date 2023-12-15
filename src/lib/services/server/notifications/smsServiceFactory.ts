import {
  IEmailService,
  IFactory,
  INotificationsConfiguration,
  IOptions,
  IServiceResolver,
  ISmsService,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';

@Injectable(
  'smsServiceFactory',
  'notificationsConfigurationOptions',
  'serviceResolver',
)
export class SmsServiceFactory implements IFactory<ISmsService> {
  private _config: INotificationsConfiguration;

  private _serviceResolver: IServiceResolver;

  constructor(
    notificationsConfigurationOptions: IOptions<INotificationsConfiguration>,
    serviceResolver: IServiceResolver,
  ) {
    this._config = notificationsConfigurationOptions.value;
    this._serviceResolver = serviceResolver;
  }

  create(): ISmsService {
    const emailServiceProvider = this._config.sms.provider || 'sns';
    switch (emailServiceProvider) {
      case 'sns':
        return this._serviceResolver.resolve<ISmsService>('snsSmsService');
      case 'twilio':
        return this._serviceResolver.resolve<ISmsService>('twilioSmsService');
      case 'console':
        return this._serviceResolver.resolve<ISmsService>(
          'fakeConsoleSmsService',
        );
      default:
        throw new Error(
          `Unknown sms service provider: ${emailServiceProvider}`,
        );
    }
  }
}

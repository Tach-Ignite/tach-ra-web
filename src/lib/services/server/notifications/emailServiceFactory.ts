import {
  IEmailService,
  IFactory,
  INotificationsConfiguration,
  IOptions,
  IServiceResolver,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';

@Injectable('emailServiceFactory', 'notificationsConfigurationOptions')
export class EmailServiceFactory implements IFactory<IEmailService> {
  private _config: INotificationsConfiguration;

  private _serviceResolver: IServiceResolver;

  constructor(
    notificationsConfigurationOptions: IOptions<INotificationsConfiguration>,
    serviceResolver: IServiceResolver,
  ) {
    this._config = notificationsConfigurationOptions.value;
    this._serviceResolver = serviceResolver;
  }

  create(): IEmailService {
    const emailServiceProvider = this._config.email.provider || 'ses';
    switch (emailServiceProvider) {
      case 'ses':
        return this._serviceResolver.resolve<IEmailService>('sesEmailService');
      case 'console':
        return this._serviceResolver.resolve<IEmailService>(
          'fakeConsoleEmailService',
        );
      default:
        throw new Error(
          `Unknown email service provider: ${emailServiceProvider}`,
        );
    }
  }
}

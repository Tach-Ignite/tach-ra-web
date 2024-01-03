import {
  IFactory,
  IOptions,
  IRecaptchaConfiguration,
  IRecaptchaValidator,
  IServiceResolver,
} from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { Injectable } from '@/lib/ioc';

@Injectable(
  'recaptchaValidatorFactory',
  'serviceResolver',
  'recaptchaConfigurationOptions',
)
export class RecaptchaValidatorFactory
  implements IFactory<IRecaptchaValidator>
{
  private _serviceResolver: IServiceResolver;

  private _recaptchaConfiguration: IRecaptchaConfiguration;

  constructor(
    serviceResolver: IServiceResolver,
    recaptchaConfigurationOptions: IOptions<IRecaptchaConfiguration>,
  ) {
    this._serviceResolver = serviceResolver;
    this._recaptchaConfiguration = recaptchaConfigurationOptions.value;
  }

  create(): IRecaptchaValidator {
    switch (this._recaptchaConfiguration.provider) {
      case 'fake':
        return this._serviceResolver.resolve<IRecaptchaValidator>(
          'fakeRecaptchaValidator',
        );
      case 'google': {
        return this._serviceResolver.resolve<IRecaptchaValidator>(
          'recaptchaValidator',
        );
      }
      default:
        throw new ErrorWithStatusCode(
          `Recaptcha provider ${this._recaptchaConfiguration.provider} is not supported.`,
          500,
        );
    }
  }
}

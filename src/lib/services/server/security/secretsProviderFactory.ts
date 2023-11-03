import {
  IFactory,
  IAsyncMultiProvider,
  IOptions,
  ISecretsConfiguration,
  IServiceResolver,
} from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { Injectable } from '@/lib/ioc';

@Injectable(
  'secretsProviderFactory',
  'serviceResolver',
  'secretsConfigurationOptions',
)
export class SecretsProviderFactory
  implements IFactory<IAsyncMultiProvider<string>>
{
  private _serviceResolver: IServiceResolver;

  private _secretConfiguration: ISecretsConfiguration;

  constructor(
    serviceResolver: IServiceResolver,
    secretsConfigurationOptions: IOptions<ISecretsConfiguration>,
  ) {
    this._serviceResolver = serviceResolver;
    this._secretConfiguration = secretsConfigurationOptions.value;
  }

  create(): IAsyncMultiProvider<string> {
    switch (this._secretConfiguration.provider) {
      case 'env':
        return this._serviceResolver.resolve<IAsyncMultiProvider<string>>(
          'envSecretsProvider',
        );
      case 'ssm':
        return this._serviceResolver.resolve<IAsyncMultiProvider<string>>(
          'ssmSecretsProvider',
        );
      default:
        throw new ErrorWithStatusCode(
          `Secrets provider ${this._secretConfiguration.provider} is not supported.`,
          500,
        );
    }
  }
}

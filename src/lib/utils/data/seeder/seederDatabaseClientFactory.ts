import {
  IOptions,
  IDatabaseClient,
  IServiceResolver,
  IFactory,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { MongoDatabaseClient } from '@/lib/services/server/data/providers/mongodb/mongoDatabaseClient';
import { ISeedDataConfiguration } from './abstractions';

@Injectable(
  'databaseClientFactory',
  'seedDataConfigurationOptions',
  'serviceResolver',
)
export class SeederDatabaseClientFactory
  implements IFactory<Promise<IDatabaseClient>>
{
  private _seedDataConfiguration: ISeedDataConfiguration;

  private _serviceResolver: IServiceResolver;

  constructor(
    seedDataConfigurationOptions: IOptions<ISeedDataConfiguration>,
    serviceResolver: IServiceResolver,
  ) {
    this._seedDataConfiguration = seedDataConfigurationOptions.value;
    this._serviceResolver = serviceResolver;
  }

  async create(): Promise<IDatabaseClient> {
    switch (this._seedDataConfiguration.provider) {
      case 'mongodb':
        return this._serviceResolver.resolve<MongoDatabaseClient>(
          'mongoDatabaseClient',
        );
      default:
        throw new Error(
          `Storage provider ${this._seedDataConfiguration.provider} is not supported.`,
        );
    }
  }
}

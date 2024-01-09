import {
  IOptions,
  IDataStorageConfiguration,
  IDatabaseClient,
  IServiceResolver,
  IFactory,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { MongoDatabaseClient } from './mongodb/mongoDatabaseClient';
import { MongoDataApiClient } from './mongodb/mongoDataApiClient';

@Injectable(
  'databaseClientFactory',
  'dataStorageConfigurationOptions',
  'serviceResolver',
)
export class DatabaseClientFactory
  implements IFactory<Promise<IDatabaseClient>>
{
  private _storageConfiguration: IDataStorageConfiguration;

  private _serviceResolver: IServiceResolver;

  constructor(
    dataStorageConfigurationOptions: IOptions<IDataStorageConfiguration>,
    serviceResolver: IServiceResolver,
  ) {
    this._storageConfiguration = dataStorageConfigurationOptions.value;
    this._serviceResolver = serviceResolver;
  }

  async create(): Promise<IDatabaseClient> {
    switch (this._storageConfiguration.provider) {
      case 'mongodb':
        return this._serviceResolver.resolve<MongoDatabaseClient>(
          'mongoDatabaseClient',
        );
      case 'mongodb-atlas-data-api':
        return this._serviceResolver.resolve<MongoDataApiClient>(
          'mongoDataApiClient',
        );
      default:
        throw new Error(
          `Storage provider ${this._storageConfiguration.provider} is not supported.`,
        );
    }
  }
}

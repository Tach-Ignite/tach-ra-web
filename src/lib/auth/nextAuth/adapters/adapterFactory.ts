import { Adapter } from 'next-auth/adapters';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import {
  IDataStorageConfiguration,
  IOptions,
  IFactory,
  IServiceResolver,
  IDatabaseClient,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import clientPromise from '@/lib/services/server/data/providers/mongodb/mongoDbClientPromise';
import { GenericDatabaseAdapter } from './database/genericDatabaseAdapter';

@Injectable(
  'adapterFactory',
  'dataStorageConfigurationOptions',
  'serviceResolver',
  // 'mongoClientFactory',
)
export class NextAuthAdapterFactory implements IFactory<Adapter> {
  private _dataStorageConfiguration: IDataStorageConfiguration;

  private _serviceResolver: IServiceResolver;

  // private _mongoClientFactory: IFactory<Promise<MongoClient>>;

  constructor(
    dataStorageConfigurationOptions: IOptions<IDataStorageConfiguration>,
    serviceResolver: IServiceResolver,
    // mongoClientFactory: IFactory<Promise<MongoClient>>,
  ) {
    this._dataStorageConfiguration = dataStorageConfigurationOptions.value;
    this._serviceResolver = serviceResolver;
    // this._mongoClientFactory = mongoClientFactory;
  }

  create(): Adapter {
    switch (this._dataStorageConfiguration.provider) {
      case 'mongodb':
        return MongoDBAdapter(clientPromise);
      case 'mongodb-atlas-data-api':
        return GenericDatabaseAdapter(
          this._serviceResolver.resolve<IDatabaseClient>('mongoDataApiClient'),
        );
      default:
        throw new Error('Storage provider not supported');
    }
  }
}

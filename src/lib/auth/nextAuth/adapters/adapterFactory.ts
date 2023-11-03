import { Adapter } from 'next-auth/adapters';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import {
  IDataStorageConfiguration,
  IOptions,
  IFactory,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'adapterFactory',
  'dataStorageConfigurationOptions',
  'mongoClientFactory',
)
export class NextAuthAdapterFactory implements IFactory<Adapter> {
  private _dataStorageConfiguration: IDataStorageConfiguration;

  private _mongoClientFactory: IFactory<Promise<MongoClient>>;

  constructor(
    dataStorageConfigurationOptions: IOptions<IDataStorageConfiguration>,
    mongoClientFactory: IFactory<Promise<MongoClient>>,
  ) {
    this._dataStorageConfiguration = dataStorageConfigurationOptions.value;
    this._mongoClientFactory = mongoClientFactory;
  }

  create(): Adapter {
    switch (this._dataStorageConfiguration.provider) {
      case 'mongodb':
        return MongoDBAdapter(this._mongoClientFactory.create());
      default:
        throw new Error('Storage provider not supported');
    }
  }
}

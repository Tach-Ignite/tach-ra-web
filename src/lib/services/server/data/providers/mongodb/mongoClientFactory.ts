import { MongoClient } from 'mongodb';
import { IAsyncMultiProvider, IFactory } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc';

@Injectable('mongoClientFactory', 'secretsProviderFactory')
export class MongoClientFactory implements IFactory<Promise<MongoClient>> {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  constructor(
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._secretsProvider = secretsProviderFactory.create();
  }

  async create(): Promise<MongoClient> {
    const uri = (await this._secretsProvider.provide('TACH_MONGO_URI'))!;
    if (!uri) {
      throw new Error(
        'Cannot connect to database. Env var not found for TACH_MONGO_URI.',
      );
    }
    const client = new MongoClient(uri, {});
    return client.connect();
  }
}

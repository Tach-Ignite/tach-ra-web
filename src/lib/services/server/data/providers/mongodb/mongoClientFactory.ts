import { MongoClient } from 'mongodb';
import { IAsyncMultiProvider, IFactory } from '@/lib/abstractions';
import { DependencyRegistry } from '@/lib/ioc/dependencyRegistry';

class MongoClientFactory implements IFactory<Promise<MongoClient>> {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  private static _mongoClient: MongoClient;

  private static _clientPromise: Promise<MongoClient>;

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
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
        _mongoClient?: MongoClient;
      };

      if (!globalWithMongo._mongoClientPromise) {
        globalWithMongo._mongoClient = new MongoClient(uri, {});
        globalWithMongo._mongoClientPromise =
          globalWithMongo._mongoClient.connect();
      }
      return globalWithMongo._mongoClientPromise;
    }
    if (!MongoClientFactory._mongoClient) {
      MongoClientFactory._mongoClient = new MongoClient(uri, {});
    }
    if (!MongoClientFactory._clientPromise) {
      MongoClientFactory._clientPromise =
        MongoClientFactory._mongoClient.connect();
    }
    return MongoClientFactory._clientPromise;
  }
}

// The workaround for the swc/next bug is to manually implement the @Injectable decorator logic:
const dependencyRegistry = new DependencyRegistry();
dependencyRegistry.registerNode('mongoClientFactory', MongoClientFactory, [
  'secretsProviderFactory',
]);

export { MongoClientFactory };

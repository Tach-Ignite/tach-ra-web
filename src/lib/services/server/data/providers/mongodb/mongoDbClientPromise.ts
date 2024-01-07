import { IAsyncMultiProvider, IFactory } from '@/lib/abstractions';
import { ModuleResolver } from '@/lib/ioc';
import { SecretsModule } from '@/lib/modules/services/server/security/secrets.module';
import { MongoClient } from 'mongodb';

const options = {};

let client;
// eslint-disable-next-line import/no-mutable-exports
let clientPromise: Promise<MongoClient>;

const m = new ModuleResolver().resolve(SecretsModule);
const secretsProviderFactory = m.resolve<IFactory<IAsyncMultiProvider<string>>>(
  'secretsProviderFactory',
);
const secretsProvider = secretsProviderFactory.create();

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = new Promise<MongoClient>(
      (resolve, reject) => {
        secretsProvider
          .provide('TACH_MONGO_URI')
          .then((uri) => {
            if (!uri) {
              reject(
                new Error(
                  'Cannot connect to database. Env var not found for TACH_MONGO_URI.',
                ),
              );
            }
            client = new MongoClient(uri, options);
            resolve(client.connect());
          })
          .catch((err) => {
            console.log(err);
            globalWithMongo._mongoClient = new MongoClient(
              'mongodb://localhost:27017',
              options,
            );
            resolve(globalWithMongo._mongoClient.connect());
          });
      },
    );
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = new Promise<MongoClient>((resolve, reject) => {
    secretsProvider
      .provide('TACH_MONGO_URI')
      .then((uri) => {
        if (!uri) {
          reject(
            new Error(
              'Cannot connect to database. Env var not found for TACH_MONGO_URI.',
            ),
          );
        }
        client = new MongoClient(uri, options);
        resolve(client.connect());
      })
      .catch((err) => {
        console.log(err);
        client = new MongoClient('mongodb://localhost:27017', options);
        resolve(client.connect());
      });
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

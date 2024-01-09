import { IAsyncMultiProvider, IFactory } from '@/lib/abstractions';
import { ModuleResolver } from '@/lib/ioc';
import { DependencyRegistry } from '@/lib/ioc/dependencyRegistry';
import { SecretsModule } from '@/lib/modules/services/server/security/secrets.module';
import { MongoClient } from 'mongodb';

const options = {};

let client;
// eslint-disable-next-line import/no-mutable-exports
let clientPromise: Promise<MongoClient>;

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
        // There are no environment variables so resolution will fail. This can happen during build.
        if (
          (!process.env.TACH_AWS_REGION ||
            !process.env.TACH_SST_APP_NAME ||
            !process.env.TACH_SST_STAGE) &&
          !process.env.secrets
        ) {
          resolve({} as MongoClient);
        }
        const dependencyRegistry = new DependencyRegistry();
        dependencyRegistry.registerModule(SecretsModule);
        const m = new ModuleResolver().resolve(SecretsModule);
        const secretsProviderFactory = m.resolve<
          IFactory<IAsyncMultiProvider<string>>
        >('secretsProviderFactory');
        const secretsProvider = secretsProviderFactory.create();
        secretsProvider.provide('TACH_MONGO_URI').then((uri) => {
          if (!uri) {
            console.log(
              'Cannot connect to database. Env var not found for TACH_MONGO_URI.',
            );
            resolve({} as MongoClient);
          } else {
            globalWithMongo._mongoClient = new MongoClient(uri, options);
            resolve(globalWithMongo._mongoClient.connect());
          }
        });
      },
    );
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = new Promise<MongoClient>((resolve, reject) => {
    // There are no environment variables so resolution will fail. This can happen during build.
    if (
      (!process.env.TACH_AWS_REGION ||
        !process.env.TACH_SST_APP_NAME ||
        !process.env.TACH_SST_STAGE) &&
      !process.env.secrets
    ) {
      resolve({} as MongoClient);
    }
    const dependencyRegistry = new DependencyRegistry();
    dependencyRegistry.registerModule(SecretsModule);
    const m = new ModuleResolver().resolve(SecretsModule);
    const secretsProviderFactory = m.resolve<
      IFactory<IAsyncMultiProvider<string>>
    >('secretsProviderFactory');
    const secretsProvider = secretsProviderFactory.create();
    secretsProvider.provide('TACH_MONGO_URI').then((uri) => {
      if (!uri) {
        console.log(
          'Cannot connect to database. Env var not found for TACH_MONGO_URI.',
        );
        resolve({} as MongoClient);
      } else {
        const client = new MongoClient(uri, options);
        resolve(client.connect());
      }
    });
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

import { MongoClient } from 'mongodb';
import {
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from 'next-auth/adapters';
import { User } from 'next-auth';
import { IFactory, IMongoDbNextAuthCollections } from '@/lib/abstractions';
// import clientPromise from '@/lib/services/server/data/providers/mongodb/mongoDbClientPromise';
import { MongoDbNextAuthCollections } from './mongoDbNextAuthCollections';

export class MongoDbNextAuthCollectionsFactory
  implements IFactory<Promise<IMongoDbNextAuthCollections>>
{
  private _mongoClientFactory: IFactory<Promise<MongoClient>>;

  private _defaultCollections = {
    Users: 'users',
    Accounts: 'accounts',
    Sessions: 'sessions',
    VerificationTokens: 'verification_tokens',
  };

  constructor(mongoClientFactory: IFactory<Promise<MongoClient>>) {
    this._mongoClientFactory = mongoClientFactory;
  }

  async create(): Promise<IMongoDbNextAuthCollections> {
    const _db = (await this._mongoClientFactory.create()).db();
    return new MongoDbNextAuthCollections(
      _db.collection<User>(this._defaultCollections.Users),
      _db.collection<AdapterAccount>(this._defaultCollections.Accounts),
      _db.collection<AdapterSession>(this._defaultCollections.Sessions),
      _db.collection<VerificationToken>(
        this._defaultCollections.VerificationTokens,
      ),
    );
  }
}

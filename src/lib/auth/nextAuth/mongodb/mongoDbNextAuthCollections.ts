import { Collection } from 'mongodb';
import {
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from 'next-auth/adapters';
import { User } from 'next-auth';
import { IMongoDbNextAuthCollections } from '@/lib/abstractions';

export class MongoDbNextAuthCollections implements IMongoDbNextAuthCollections {
  Users: Collection<User>;

  Accounts: Collection<AdapterAccount>;

  Sessions: Collection<AdapterSession>;

  VerificationTokens: Collection<VerificationToken>;

  constructor(
    users: Collection<User>,
    accounts: Collection<AdapterAccount>,
    sessions: Collection<AdapterSession>,
    verificationTokens: Collection<VerificationToken>,
  ) {
    this.Users = users;
    this.Accounts = accounts;
    this.Sessions = sessions;
    this.VerificationTokens = verificationTokens;
  }
}

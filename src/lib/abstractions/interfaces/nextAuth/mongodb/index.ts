import { Collection } from 'mongodb';
import { User } from 'next-auth';
import {
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from 'next-auth/adapters';

export interface IMongoDbNextAuthCollections {
  Users: Collection<User>;
  Accounts: Collection<AdapterAccount>;
  Sessions: Collection<AdapterSession>;
  VerificationTokens: Collection<VerificationToken>;
}

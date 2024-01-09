import { IDatabaseClient } from '@/lib/abstractions';
import { Account } from 'next-auth';
import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters';

export const format = {
  /** Takes a mongoDB object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    Object.keys(object).forEach((key) => {
      const value = object[key];
      if (key === '_id' && value) {
        newObject.id = value;
      } else if (key === 'userId' && value) {
        newObject[key] = value;
      } else {
        newObject[key] = value;
      }
    });
    return newObject as T;
  },
  /** Takes a plain old JavaScript object and turns it into a mongoDB object */
  to<T = Record<string, unknown>>(object: Record<string, any>) {
    const newObject: Record<string, unknown> = {
      _id: object.id,
    };
    Object.keys(object).forEach((key) => {
      const value = object[key];
      if (key === 'userId') newObject[key] = value;
      else if (key !== 'id') {
        newObject[key] = value;
      }
    });
    return newObject as T & { _id: string };
  },
};

export function GenericDatabaseAdapter(
  client: IDatabaseClient,
  options: any = {},
): Adapter {
  const { from, to } = format;
  return {
    async createUser(data) {
      const user = to<AdapterUser>(data);
      const insertResponse = await client.insert(user, 'users');
      return from<AdapterUser>({ ...user, _id: insertResponse.insertedIds[0] });
    },
    async getUser(id) {
      const users = await client.select<AdapterUser>({ _id: id }, 'users');
      return users.length > 0 ? from<AdapterUser>(users[0]) : null;
    },
    async getUserByEmail(email) {
      const users = await client.select<AdapterUser>({ email }, 'users');
      return users.length > 0 ? from<AdapterUser>(users[0]) : null;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await client.select<AdapterAccount & { _id: any }>(
        { providerAccountId, provider },
        'accounts',
      );
      if (account.length === 0) {
        return null;
      }
      const users = await client.select<AdapterUser>(
        { _id: account[0].userId },
        'users',
      );
      return users.length > 0 ? from<AdapterUser>(users[0]) : null;
    },
    async updateUser(data) {
      const { _id, ...user } = to<AdapterUser>(data);
      const updateResponse = await client.updateMany({ _id }, user, 'users');
      const updatedUser = await client.select<AdapterUser>({ _id }, 'users');
      if (updatedUser.length === 0) {
        throw new Error('User not found');
      }
      return from<AdapterUser>(updatedUser[0]);
    },
    async deleteUser(userId) {
      await Promise.all([
        client.deleteMany({ _id: userId }, 'users'),
        client.deleteMany({ userId }, 'accounts'),
        client.deleteMany({ userId }, 'sessions'),
      ]);
    },
    async linkAccount(data) {
      const account = to<AdapterAccount>(data);
      const insertResponse = await client.insert(account, 'accounts');
      return account;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const accounts = await client.select<AdapterAccount & { _id: any }>(
        { providerAccountId, provider },
        'accounts',
      );
      if (!accounts || accounts.length === 0) {
        throw new Error('Account not found');
      }
      const DeleteResponse = await client.deleteMany(
        { providerAccountId, provider },
        'accounts',
      );
      return from<AdapterAccount>(accounts[0]);
    },
    async createSession(data) {
      const session = to<AdapterSession>(data);
      const insertResponse = await client.insert(session, 'sessions');
      return from<AdapterSession>(session);
    },
    async getSessionAndUser(sessionToken) {
      const sessions = await client.select<AdapterSession & { _id: any }>(
        { sessionToken },
        'sessions',
      );
      if (sessions.length === 0) {
        return null;
      }
      if (sessions[0].expires && typeof sessions[0].expires === 'string') {
        sessions[0].expires = new Date(
          sessions[0].expires as unknown as string,
        );
      }

      const users = await client.select<AdapterUser>(
        { _id: sessions[0].userId },
        'users',
      );
      if (users.length === 0) {
        return null;
      }
      return {
        session: from<AdapterSession>(sessions[0]),
        user: from<AdapterUser>(users[0]),
      };
    },
    async updateSession(data) {
      const { _id, ...session } = to<AdapterSession>(data);
      const updateResponse = await client.updateMany(
        { _id },
        session,
        'sessions',
      );
      const sessions = await client.select<AdapterSession & { _id: any }>(
        { _id },
        'sessions',
      );
      if (sessions.length === 0) {
        throw new Error('Session not found');
      }
      if (sessions[0].expires && typeof sessions[0].expires === 'string') {
        sessions[0].expires = new Date(
          sessions[0].expires as unknown as string,
        );
      }
      return from<AdapterSession>(sessions[0]);
    },
    async deleteSession(sessionToken) {
      const sessions = await client.select<AdapterSession & { _id: any }>(
        { sessionToken },
        'sessions',
      );
      if (sessions.length === 0) {
        throw new Error('Session not found');
      }
      if (sessions[0].expires && typeof sessions[0].expires === 'string') {
        sessions[0].expires = new Date(
          sessions[0].expires as unknown as string,
        );
      }
      const DeleteResponse = await client.deleteMany(
        { sessionToken },
        'sessions',
      );
      return from<AdapterSession>(sessions[0]);
    },
    async createVerificationToken(data) {
      const verificationToken = await client.insert(
        to(data),
        'verification_tokens',
      );
      return data;
    },
    async useVerificationToken(data) {
      const verificationToken = await client.select<
        VerificationToken & { _id: any }
      >(data, 'verification_tokens');
      if (verificationToken.length === 0) {
        return null;
      }
      const DeleteResponse = await client.deleteMany(
        data,
        'verification_tokens',
      );
      const { _id, ...rest } = verificationToken[0];
      return rest;
    },
  };
}

import { FindOptions, MongoClient, ObjectId } from 'mongodb';
import {
  IFactory,
  DeleteResponse,
  InsertResponse,
  UpdateResponse,
  IDatabaseClient,
  QueryOptions,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import clientPromise from '@/lib/services/server/data/providers/mongodb/mongoDbClientPromise';

@Injectable(
  'mongoDatabaseClient',
  'mongoClientFactory',
  'connectionMethodology',
)
export class MongoDatabaseClient implements IDatabaseClient {
  private _clientFactory: IFactory<Promise<MongoClient>>;

  private _connectionMethodology: 'module' | 'factory';

  constructor(
    mongoClientFactory: IFactory<Promise<MongoClient>>,
    connectionMethodology: 'module' | 'factory' = 'module',
  ) {
    this._clientFactory = mongoClientFactory;
    this._connectionMethodology = connectionMethodology;
  }

  private async getClient(): Promise<MongoClient> {
    switch (this._connectionMethodology) {
      case 'module':
        return clientPromise;
      case 'factory':
        return this._clientFactory.create();
      default:
        throw new Error(
          `Invalid connection methodology: ${this._connectionMethodology}`,
        );
    }
  }

  async insert<T>(
    data: T | Array<T>,
    collectionName: string,
  ): Promise<InsertResponse> {
    const client = await this.getClient();
    const db = client.db();
    const now = new Date();
    let possibleId = (data as any)._id;
    if (possibleId && typeof possibleId === 'string') {
      try {
        possibleId = new ObjectId(possibleId);
      } catch (e) {
        // ignore
      }
    }
    if (!Array.isArray(data)) {
      const result = await db.collection(collectionName).insertOne({
        ...data,
        _id: possibleId,
        createdAt: now,
        updatedAt: now,
      });
      return { insertedIds: [result.insertedId.toString()] };
    }
    const result = await db.collection(collectionName).insertMany(
      data.map((item) => {
        let possibleId = (data as any)._id;
        if (possibleId && typeof possibleId === 'string') {
          try {
            possibleId = new ObjectId(possibleId);
          } catch (e) {
            // ignore
          }
        }
        return { ...item, _id: possibleId, createdAt: now, updatedAt: now };
      }),
      {},
    );
    return {
      insertedIds: Object.entries(result.insertedIds).map(([key, value]) =>
        value.toString(),
      ),
    };
  }

  async updateMany<T extends object>(
    filter: any,
    data: Partial<T>,
    collectionName: string,
  ): Promise<UpdateResponse> {
    const client = await this.getClient();
    const db = client.db();
    const now = new Date();
    const filtered = Object.keys(data)
      .filter((key) => key !== '_id' && !key.startsWith('$'))
      .reduce((obj: any, key) => {
        obj[key] = (data as any)[key];
        return obj;
      }, {});
    if (typeof filter._id === 'string') {
      filter._id = new ObjectId(filter._id);
    }
    const commands = Object.keys(data)
      .filter((key) => key.startsWith('$'))
      .reduce((obj: any, key) => {
        obj[key] = (data as any)[key];
        return obj;
      }, {});
    filtered.updatedAt = now;
    const ids = await db.collection(collectionName).distinct('_id', filter);
    const result = await db
      .collection(collectionName)
      .updateMany(filter, { $set: filtered, ...commands });
    return {
      updatedIds: ids.map((id) => id.toString()),
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  async deleteMany<T>(
    filter: any,
    collectionName: string,
  ): Promise<DeleteResponse> {
    const client = await this.getClient();
    const db = client.db();
    if (typeof filter._id === 'string') {
      filter._id = new ObjectId(filter._id);
    }
    const ids = await db.collection(collectionName).distinct('_id', filter);
    const result = await db.collection(collectionName).deleteMany(filter);
    return { deletedIds: ids.map((id) => id.toString()) };
  }

  async select<T extends { _id: string }>(
    filter: any,
    collectionName: string,
    fields: string[] | undefined = undefined,
    queryOptions: QueryOptions | undefined = undefined,
  ): Promise<Array<T>> {
    const client = await this.getClient();
    const db = client.db();
    if (filter._id && typeof filter._id === 'object') {
      Object.keys(filter._id).forEach((key) => {
        if (typeof filter._id[key] === 'string') {
          filter._id[key] = new ObjectId(filter._id[key]);
        } else if (Array.isArray(filter._id[key])) {
          filter._id[key] = filter._id[key].map(
            (id: string) => new ObjectId(id),
          );
        }
      });
    } else if (filter._id && typeof filter._id === 'string') {
      try {
        filter._id = new ObjectId(filter._id);
      } catch (e) {
        // ignore
      }
    }
    const options: FindOptions<Document> = queryOptions
      ? { ...queryOptions }
      : {};
    if (fields) {
      const projection: any = {};
      for (let i = 0; i < fields.length; i++) {
        projection[fields[i]] = 1;
      }
      options.projection = projection;
    }

    const result = await db.collection(collectionName).find(filter, options);
    return result
      .map((item) => {
        const { _id, ...rest } = item;
        Object.keys(rest).forEach((key) => {
          if (rest[key] instanceof ObjectId) {
            rest[key] = rest[key].toString();
          }
        });
        return { _id: _id.toString(), ...rest } as T;
      })
      .toArray();
  }

  async createIndex(index: any, collectionName: string): Promise<void> {
    const client = await this.getClient();
    const db = client.db();
    await db.collection(collectionName).createIndex(index);
  }

  async generateId(collectionName: string): Promise<string> {
    return new ObjectId().toString();
  }

  async stringToId(id: string, collectionName: string): Promise<any> {
    return new ObjectId(id);
  }

  async truncate<T>(): Promise<boolean> {
    const client = await this.getClient();
    const db = client.db();
    const promises: Promise<any>[] = [];
    const collections = await db.collections();
    if (collections === undefined) {
      return false;
    }
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].collectionName !== 'deleteme') {
        promises.push(db.dropCollection(collections[i].collectionName));
      }
    }

    await Promise.all(promises);
    return true;
  }
}

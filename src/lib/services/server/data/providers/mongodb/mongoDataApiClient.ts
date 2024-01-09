import { FindOptions, MongoClient, ObjectId } from 'mongodb';
import {
  IFactory,
  DeleteResponse,
  InsertResponse,
  UpdateResponse,
  IDatabaseClient,
  QueryOptions,
  IAsyncMultiProvider,
  WithId,
} from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('mongoDataApiClient', 'secretsProviderFactory')
export class MongoDataApiClient implements IDatabaseClient {
  private _secretsProvider: IAsyncMultiProvider<string | undefined>;

  private _apiKey: string = '';

  private _baseUri: string = '';

  private _dataSource: string = '';

  private _database: string = '';

  constructor(
    secretsProviderFactory: IFactory<IAsyncMultiProvider<string | undefined>>,
  ) {
    this._secretsProvider = secretsProviderFactory.create();
  }

  private getConnectionData(): Promise<{
    baseUri: string;
    apiKey: string;
    dataSource: string;
    database: string;
  }> {
    if (this._baseUri && this._apiKey && this._dataSource && this._database) {
      return Promise.resolve({
        baseUri: this._baseUri,
        apiKey: this._apiKey,
        dataSource: this._dataSource,
        database: this._database,
      });
    }
    return Promise.all([
      this._secretsProvider.provide('TACH_MONGO_DATA_API_URI'),
      this._secretsProvider.provide('TACH_MONGO_DATA_API_KEY'),
      this._secretsProvider.provide('TACH_MONGO_DATA_API_DATA_SOURCE'),
      this._secretsProvider.provide('TACH_MONGO_DATA_API_DATABASE_NAME'),
    ]).then(([baseUri, apiKey, dataSource, database]) => {
      if (!baseUri) {
        throw new Error(
          'Cannot connect to database. Env var not found for TACH_MONGO_DATA_API_URI.',
        );
      }
      if (!apiKey) {
        throw new Error(
          'Cannot connect to database. Env var not found for TACH_MONGO_DATA_API_KEY.',
        );
      }
      if (!dataSource) {
        throw new Error(
          'Cannot connect to database. Env var not found for TACH_MONGO_DATA_API_DATA_SOURCE.',
        );
      }
      if (!database) {
        database = 'test';
      }
      if (baseUri.endsWith('/')) {
        baseUri = baseUri.slice(0, -1);
      }
      this._baseUri = baseUri;
      this._apiKey = apiKey;
      this._dataSource = dataSource;
      this._database = database;
      return { baseUri, apiKey, dataSource, database };
    });
  }

  async insert<T>(
    data: T | Array<T>,
    collectionName: string,
  ): Promise<InsertResponse> {
    const { baseUri, apiKey, dataSource, database } =
      await this.getConnectionData();
    const now = new Date();
    let possibleId = (data as any)._id;
    if (possibleId && typeof possibleId === 'string') {
      possibleId = { $oid: possibleId };
    }
    if (!Array.isArray(data)) {
      const result = await fetch(`${baseUri}/action/insertOne`, {
        method: 'POST',
        body: JSON.stringify({
          dataSource,
          database,
          collection: collectionName,
          document: {
            ...data,
            _id: possibleId,
            createdAt: now,
            updatedAt: now,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      });
      const json = await result.json();
      return { insertedIds: [json.insertedId.toString()] };
    }
    const result = await fetch(`${baseUri}/action/insertMany`, {
      method: 'POST',
      body: JSON.stringify({
        dataSource,
        database,
        collection: collectionName,
        documents: data.map((item) => {
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
      }),
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });
    const json = await result.json();
    return {
      insertedIds: json.insertedIds,
    };
  }

  async updateMany<T extends object>(
    filter: any,
    data: Partial<T>,
    collectionName: string,
  ): Promise<UpdateResponse> {
    const { baseUri, apiKey, dataSource, database } =
      await this.getConnectionData();
    const now = new Date();
    const filtered = Object.keys(data)
      .filter((key) => key !== '_id' && !key.startsWith('$'))
      .reduce((obj: any, key) => {
        obj[key] = (data as any)[key];
        return obj;
      }, {});
    if (typeof filter._id === 'string') {
      filter._id = { $oid: filter._id };
    }
    const commands = Object.keys(data)
      .filter((key) => key.startsWith('$'))
      .reduce((obj: any, key) => {
        obj[key] = (data as any)[key];
        return obj;
      }, {});
    filtered.updatedAt = now;
    const pipeline = [{ $match: filter }, { $group: { _id: '$_id' } }];
    const ids: string[] = await fetch(`${baseUri}/action/aggregate`, {
      method: 'POST',
      body: JSON.stringify({
        dataSource,
        database,
        collection: collectionName,
        pipeline,
      }),
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    })
      .then((result) => result.json())
      .then((json) => json.documents.map((item: any) => item._id));
    const result = await fetch(`${baseUri}/action/updateMany`, {
      method: 'POST',
      body: JSON.stringify({
        dataSource,
        database,
        collection: collectionName,
        filter,
        update: { $set: filtered, ...commands },
      }),
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });
    const json = await result.json();
    return {
      updatedIds: ids,
      matchedCount: json.matchedCount,
      modifiedCount: json.modifiedCount,
    };
  }

  async deleteMany<T>(
    filter: any,
    collectionName: string,
  ): Promise<DeleteResponse> {
    const { baseUri, apiKey, dataSource, database } =
      await this.getConnectionData();
    if (typeof filter._id === 'string') {
      filter._id = { $oid: filter._id };
    }

    const pipeline = [{ $match: filter }, { $group: { _id: '$_id' } }];
    const ids: string[] = await fetch(`${baseUri}/action/aggregate`, {
      method: 'POST',
      body: JSON.stringify({
        dataSource,
        database,
        collection: collectionName,
        pipeline,
      }),
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    })
      .then((result) => result.json())
      .then((json) => json.documents.map((item: any) => item._id));
    const result = await fetch(`${baseUri}/action/deleteMany`, {
      method: 'POST',
      body: JSON.stringify({
        dataSource,
        database,
        collection: collectionName,
        filter,
      }),
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });
    const json = await result.json();
    // TODO: add deletedCount to api
    return { deletedIds: ids };
  }

  async select<T extends { _id: string }>(
    filter: any,
    collectionName: string,
    fields: string[] | undefined = undefined,
    queryOptions: QueryOptions | undefined = undefined,
  ): Promise<Array<T>> {
    const { baseUri, apiKey, dataSource, database } =
      await this.getConnectionData();
    if (filter._id && typeof filter._id === 'object') {
      Object.keys(filter._id).forEach((key) => {
        if (typeof filter._id[key] === 'string') {
          filter._id[key] = { $oid: filter._id[key] };
        } else if (Array.isArray(filter._id[key])) {
          filter._id[key] = filter._id[key].map((id: string) => ({ $oid: id }));
        }
      });
    } else if (filter._id && typeof filter._id === 'string') {
      filter._id = { $oid: filter._id };
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

    const result = await fetch(`${baseUri}/action/find`, {
      method: 'POST',
      body: JSON.stringify({
        dataSource,
        database,
        collection: collectionName,
        filter,
        ...options,
      }),
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });
    const json = await result.json();

    return json.documents.map((item: WithId<any>) => {
      const { _id, ...rest } = item;
      Object.keys(rest).forEach((key) => {
        if (rest[key] instanceof ObjectId) {
          rest[key] = rest[key].toString();
        }
      });
      return { _id: _id.toString(), ...rest } as T;
    });
  }

  async createIndex(index: any, collectionName: string): Promise<void> {
    throw new Error("The MongoDb Atlas Data API doesn't support createIndex.");
  }

  async generateId(collectionName: string): Promise<string> {
    return new ObjectId().toString();
  }

  async stringToId(id: string, collectionName: string): Promise<any> {
    return new ObjectId(id);
  }

  async truncate<T>(): Promise<boolean> {
    throw new Error("The MongoDb Atlas Data API doesn't support truncate.");
  }
}

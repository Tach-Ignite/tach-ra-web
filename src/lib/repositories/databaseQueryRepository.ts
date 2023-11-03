import {
  IDatabaseClient,
  IFactory,
  IdModel,
  IQueryRepository,
  QueryOptions,
} from '@/lib/abstractions';
import { Injectable } from '../ioc/injectable';

@Injectable(
  'databaseQueryRepository',
  'databaseClientFactory',
  'collectionName',
)
export class DatabaseQueryRepository<T extends object>
  implements IQueryRepository<T>
{
  protected _databaseClientFactory: IFactory<Promise<IDatabaseClient>>;

  protected _collectionName: string;

  constructor(
    databaseClientFactory: IFactory<Promise<IDatabaseClient>>,
    collectionName: string,
  ) {
    this._databaseClientFactory = databaseClientFactory;
    this._collectionName = collectionName;
  }

  async getById(id: string): Promise<(T & IdModel) | null> {
    const databaseClient = await this._databaseClientFactory.create();
    const result = await databaseClient.select<T & IdModel>(
      { _id: id },
      this._collectionName,
    );
    if (result.length === 0) {
      return null;
    }
    if (result.length > 1) {
      throw new Error(
        `Expected to retrieve 1 record, but retrieved ${result.length} records.`,
      );
    }
    return result[0];
  }

  async list(queryOptions?: QueryOptions): Promise<(T & IdModel)[]> {
    return this.find({}, queryOptions);
  }

  async find(
    filter: any,
    queryOptions?: QueryOptions,
  ): Promise<(T & IdModel)[]> {
    const databaseClient = await this._databaseClientFactory.create();
    const result = await databaseClient.select<T & IdModel>(
      filter,
      this._collectionName,
      undefined,
      queryOptions,
    );
    return result;
  }
}

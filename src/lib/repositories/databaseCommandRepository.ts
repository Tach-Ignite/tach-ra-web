import {
  IDatabaseClient,
  IFactory,
  ICommandRepository,
} from '@/lib/abstractions';
import { Injectable } from '../ioc/injectable';

@Injectable(
  'databaseCommandRepository',
  'databaseClientFactory',
  'collectionName',
)
export class DatabaseCommandRepository<T extends object>
  implements ICommandRepository<T>
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

  async create(entity: T): Promise<string> {
    const databaseClient = await this._databaseClientFactory.create();
    const result = await databaseClient.insert<T>(entity, this._collectionName);
    if (result.insertedIds.length !== 1) {
      throw new Error(
        `Expected to insert 1 record, but inserted ${result.insertedIds.length} records.`,
      );
    }
    return result.insertedIds[0];
  }

  async update(id: string, entity: Partial<T>): Promise<void> {
    const databaseClient = await this._databaseClientFactory.create();
    const result = await databaseClient.updateMany<T>(
      { _id: id },
      entity,
      this._collectionName,
    );
    if (result.modifiedCount !== 1) {
      throw new Error(
        `Expected to update 1 record, but updated ${result.modifiedCount} records.`,
      );
    }
  }

  async delete(id: string): Promise<void> {
    const databaseClient = await this._databaseClientFactory.create();
    const result = await databaseClient.deleteMany<T>(
      { _id: id },
      this._collectionName,
    );
    if (result.deletedIds.length !== 1) {
      throw new Error(
        `Expected to delete 1 record, but deleted ${result.deletedIds.length} records.`,
      );
    }
  }

  async generateId(): Promise<string> {
    const databaseClient = await this._databaseClientFactory.create();
    return databaseClient.generateId(this._collectionName);
  }
}

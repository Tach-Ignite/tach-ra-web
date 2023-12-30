import { CartDto, UserDto } from '@/models';
import { IDatabaseClient, IFactory, IdModel } from '@/lib/abstractions';
import { ICartQueryRepository } from '@/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('cartQueryRepository', 'databaseClientFactory')
export class CartQueryDatabaseRepository implements ICartQueryRepository {
  private _collectionName: string;

  private _databaseClientFactory: IFactory<Promise<IDatabaseClient>>;

  constructor(databaseClientFactory: IFactory<Promise<IDatabaseClient>>) {
    this._collectionName = 'users';
    this._databaseClientFactory = databaseClientFactory;
  }

  async getCart(id: string): Promise<CartDto | null> {
    const databaseClient = await this._databaseClientFactory.create();
    const result = await databaseClient.select<UserDto & IdModel>(
      { _id: id },
      this._collectionName,
      ['cart'],
    );
    if (result.length === 0) {
      return null;
    }
    if (result.length > 1) {
      throw new Error(
        `Expected to retrieve 1 record, but retrieved ${result.length} records.`,
      );
    }
    if (!result[0].cart) {
      result[0].cart = { items: [] };
      await databaseClient.updateMany(
        { _id: id },
        { cart: result[0].cart },
        this._collectionName,
      );
    }
    return result[0].cart;
  }
}

import { DatabaseCommandRepository } from '@/lib/repositories';
import { IDatabaseClient, IFactory, IdModel } from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors/';
import { UserDto } from '@/models';
import { IUserAddressCommandRepository } from '@/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('userAddressCommandRepository', 'databaseClientFactory')
export class UserAddressDatabaseCommandRepository
  extends DatabaseCommandRepository<UserDto>
  implements IUserAddressCommandRepository
{
  constructor(databaseClientFactory: IFactory<Promise<IDatabaseClient>>) {
    super(databaseClientFactory, 'users');
  }

  async addAddressAndRecipientForUser(
    userId: string,
    addressId: string,
    recipientName: string,
  ): Promise<string> {
    const databaseClient = await this._databaseClientFactory.create();
    const newId = await databaseClient.generateId(this._collectionName);
    const result = await databaseClient.updateMany(
      { _id: userId },
      {
        $push: {
          addresses: {
            _id: newId,
            addressId,
            recipientName,
          },
        },
      },
      this._collectionName,
    );

    if (result.modifiedCount !== 1) {
      throw new ErrorWithStatusCode(
        `Could not add address and recipient for user with id ${userId}.`,
        500,
        'Error adding address and recipient for user.',
      );
    }

    return newId;
  }

  async setDefaultAddressForUser(
    userId: string,
    userAddressId: string | null,
  ): Promise<void> {
    await this.update(userId, {
      defaultUserAddressId: userAddressId,
    });
  }

  async removeUserAddressByUserAddressId(
    userId: string,
    userAddressId: string,
  ): Promise<void> {
    const databaseClient = await this._databaseClientFactory.create();
    const users = await databaseClient.select<UserDto & IdModel>(
      { _id: userId },
      'users',
    );

    if (users.length === 0) {
      throw new ErrorWithStatusCode(
        `No user found with id ${userId}.`,
        404,
        'User not found.',
      );
    }

    const user = users[0];

    const updateObject: any = {
      $pull: {
        addresses: {
          _id: userAddressId,
        },
      },
    };

    if (user.defaultUserAddressId === userAddressId) {
      updateObject.$set = { defaultUserAddressId: null };
    }

    const result = await databaseClient.updateMany(
      { _id: userId },
      updateObject,
      this._collectionName,
    );

    if (result.modifiedCount !== 1) {
      throw new ErrorWithStatusCode(
        `Could not remove address for user with id ${userId} and address id ${userAddressId}.`,
        500,
        'Error removing address for user.',
      );
    }
  }
}

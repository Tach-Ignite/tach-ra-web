import { ICategoryCommandRepository } from '@/abstractions';
import { IDatabaseClient, IFactory } from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { Injectable } from '@/lib/ioc/injectable';
import { DatabaseCommandRepository } from '@/lib/repositories/databaseCommandRepository';
import { CategoryDto } from '@/models';

@Injectable('categoryCommandRepository', 'databaseClientFactory')
export class CategoryCommandDatabaseRepository
  extends DatabaseCommandRepository<CategoryDto>
  implements ICategoryCommandRepository
{
  constructor(databaseClientFactory: IFactory<Promise<IDatabaseClient>>) {
    super(databaseClientFactory, 'categories');
  }

  async addChildIdToParent(parentId: string, childId: string): Promise<void> {
    const databaseClient = await this._databaseClientFactory.create();
    const result = await databaseClient.updateMany(
      { _id: parentId },
      { $push: { childIds: childId } },
      this._collectionName,
    );

    if (result.modifiedCount !== 1) {
      throw new ErrorWithStatusCode(
        `Could not add child id ${childId} to parent id ${parentId}.`,
        500,
        'Could not add child id to parent.',
      );
    }
  }

  async removeChildIdFromParent(
    parentId: string,
    childId: string,
  ): Promise<void> {
    const databaseClient = await this._databaseClientFactory.create();
    const result = await databaseClient.updateMany(
      { _id: parentId },
      { $pull: { childIds: childId } },
      this._collectionName,
    );

    if (result.modifiedCount !== 1) {
      throw new ErrorWithStatusCode(
        `Could not add child id ${childId} to parent id ${parentId}.`,
        500,
        'Could not add child id to parent.',
      );
    }
  }
}

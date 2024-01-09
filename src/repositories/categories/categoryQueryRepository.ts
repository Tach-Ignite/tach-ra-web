import { IDatabaseClient, IFactory, IdModel } from '@/lib/abstractions';
import { CategoryDto } from '@/models';
import { ICategoryQueryRepository } from '@/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { DatabaseQueryRepository } from '@/lib/repositories/databaseQueryRepository';

@Injectable('categoryQueryRepository', 'databaseClientFactory')
export class CategoryQueryDatabaseRepository
  extends DatabaseQueryRepository<CategoryDto>
  implements ICategoryQueryRepository
{
  constructor(databaseClientFactory: IFactory<Promise<IDatabaseClient>>) {
    super(databaseClientFactory, 'categories');
  }

  async getAllCategoriesWithParentId(parentId: string): Promise<CategoryDto[]> {
    const databaseClient = await this._databaseClientFactory.create();
    const categories = await databaseClient.select<CategoryDto & IdModel>(
      { parentId },
      this._collectionName,
    );

    return categories;
  }
}

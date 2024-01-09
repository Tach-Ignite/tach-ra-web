import { IProductCommandRepository } from '@/abstractions';
import { IDatabaseClient, IFactory } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { DatabaseCommandRepository } from '@/lib/repositories/databaseCommandRepository';
import { ProductDto } from '@/models';

@Injectable('productCommandRepository', 'databaseClientFactory')
export class ProductCommandDatabaseRepository
  extends DatabaseCommandRepository<ProductDto>
  implements IProductCommandRepository
{
  constructor(databaseClientFactory: IFactory<Promise<IDatabaseClient>>) {
    super(databaseClientFactory, 'products');
  }

  async removeCategoryFromAllProducts(categoryId: string): Promise<void> {
    const databaseClient = await this._databaseClientFactory.create();
    const result = await databaseClient.updateMany(
      { categoryIds: categoryId },
      { $pull: { categoryIds: categoryId } },
      this._collectionName,
    );
  }
}

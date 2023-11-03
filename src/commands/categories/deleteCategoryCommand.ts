import { ICategoryService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { DeleteCategoryCommandPayload } from '@/models';

@Injectable('deleteCategoryCommand', 'categoryService', 'payload')
export class DeleteCategoryCommand extends Command<
  DeleteCategoryCommandPayload,
  void
> {
  private _categoryService: ICategoryService;

  constructor(
    categoryService: ICategoryService,
    payload: DeleteCategoryCommandPayload,
  ) {
    super(payload);
    this._categoryService = categoryService;
  }

  async execute(): Promise<void> {
    await this._categoryService.deleteCategory(this._payload.categoryId);
  }
}

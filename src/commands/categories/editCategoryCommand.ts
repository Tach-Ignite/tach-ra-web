import { ICategoryService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { EditCategoryCommandPayload, ICategory } from '@/models';

@Injectable('editCategoryCommand', 'categoryService', 'payload')
export class EditCategoryCommand extends Command<
  EditCategoryCommandPayload,
  ICategory
> {
  private _categoryService: ICategoryService;

  constructor(
    categoryService: ICategoryService,
    payload: EditCategoryCommandPayload,
  ) {
    super(payload);
    this._categoryService = categoryService;
  }

  async execute(): Promise<void> {
    this.result = await this._categoryService.editCategory(
      this._payload.categoryId,
      this._payload.category,
    );
  }
}

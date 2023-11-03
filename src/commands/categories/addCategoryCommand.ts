import { ICategory, AddCategoryCommandPayload } from '@/models';
import { ICategoryService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('addCategoryCommand', 'categoryService', 'payload')
export class AddCategoryCommand extends Command<
  AddCategoryCommandPayload,
  ICategory
> {
  private _categoryService: ICategoryService;

  constructor(
    categoryService: ICategoryService,
    payload: AddCategoryCommandPayload,
  ) {
    super(payload);
    this._categoryService = categoryService;
  }

  async execute(): Promise<void> {
    this.result = await this._categoryService.addCategory(
      this._payload.category,
    );
  }
}

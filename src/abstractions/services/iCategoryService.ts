import { ICategory } from '@/models';

export interface ICategoryService {
  getAllCategories(): Promise<ICategory[]>;
  getCategoryById(categoryId: string): Promise<ICategory | null>;
  addCategory(category: ICategory): Promise<ICategory>;
  editCategory(categoryId: string, category: ICategory): Promise<ICategory>;
  deleteCategory(categoryId: string): Promise<void>;
}

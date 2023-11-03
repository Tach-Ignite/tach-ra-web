import { ICategory } from '../../../domain/category';

export type EditCategoryCommandPayload = {
  categoryId: string;
  category: ICategory;
};

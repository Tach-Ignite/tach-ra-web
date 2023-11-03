import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { AddCategoryCommandPayload } from './addCategoryCommandPayload';
import { EditCategoryCommandPayload } from './editCategoryCommandPayload';
import { DeleteCategoryCommandPayload } from './deleteCategoryCommandPayload';

export function createCategoryPayloadMetadata() {
  PojosMetadataMap.create<AddCategoryCommandPayload>(
    'AddCategoryCommandPayload',
    {
      category: 'ICategory',
    },
  );
  PojosMetadataMap.create<EditCategoryCommandPayload>(
    'EditCategoryCommandPayload',
    {
      categoryId: String,
      category: 'ICategory',
    },
  );
  PojosMetadataMap.create<DeleteCategoryCommandPayload>(
    'DeleteCategoryCommandPayload',
    {
      categoryId: String,
    },
  );
}

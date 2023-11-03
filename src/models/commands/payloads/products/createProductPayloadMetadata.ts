import { PojosMetadataMap } from '@jersmart/automapper-pojos';
import { CreateProductCommandPayload } from './createProductCommandPayload';
import { EditProductCommandPayload } from './editProductCommandPayload';
import { DeleteProductCommandPayload } from './deleteProductCommandPayload';

export function createProductPayloadMetadata() {
  PojosMetadataMap.create<CreateProductCommandPayload>(
    'CreateProductCommandPayload',
    {
      product: 'IProduct',
      productImages: ['FileLike'],
    },
  );
  PojosMetadataMap.create<EditProductCommandPayload>(
    'EditProductCommandPayload',
    {
      productId: String,
      product: 'IProduct',
      productImages: ['FileLike'],
    },
  );
  PojosMetadataMap.create<DeleteProductCommandPayload>(
    'DeleteProductCommandPayload',
    {
      productId: String,
    },
  );
}

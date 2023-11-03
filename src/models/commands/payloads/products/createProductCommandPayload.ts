import { FileLike } from '@/lib/abstractions';
import { IProduct } from '../../../domain/product';

export type CreateProductCommandPayload = {
  product: IProduct;
  productImages: FileLike[];
};

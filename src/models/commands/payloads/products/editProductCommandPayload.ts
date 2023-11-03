import { FileLike } from '@/lib/abstractions';
import { IProduct } from '../../../domain/product';

export type EditProductCommandPayload = {
  productId: string;
  product: IProduct;
  productImages?: FileLike[];
};

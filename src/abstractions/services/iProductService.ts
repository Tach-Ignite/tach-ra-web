import { FileLike, QueryOptions } from '@/lib/abstractions';
import { IProduct } from '@/models';

export interface IProductService {
  getAllProducts(queryOptions?: QueryOptions): Promise<IProduct[]>;
  getProductById(productId: string): Promise<IProduct>;
  searchProducts(
    searchTerm: string,
    queryOptions?: QueryOptions,
  ): Promise<IProduct[]>;
  createProduct(
    product: IProduct,
    productImages: FileLike[],
  ): Promise<IProduct>;
  editProduct(
    productId: string,
    product: IProduct,
    productImages?: FileLike[],
  ): Promise<IProduct>;
  deleteProduct(productId: string): Promise<void>;
}

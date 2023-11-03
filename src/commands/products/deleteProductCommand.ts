import { IProductService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { DeleteProductCommandPayload } from '@/models';

@Injectable('deleteProductCommand', 'productService', 'payload')
export class DeleteProductCommand extends Command<
  DeleteProductCommandPayload,
  void
> {
  private _productService: IProductService;

  constructor(
    productService: IProductService,
    payload: DeleteProductCommandPayload,
  ) {
    super(payload);
    this._productService = productService;
  }

  async execute(): Promise<void> {
    await this._productService.deleteProduct(this._payload.productId);
  }
}

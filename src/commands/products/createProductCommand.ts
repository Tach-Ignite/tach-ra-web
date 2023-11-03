import { IProductService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { IProduct, CreateProductCommandPayload } from '@/models';

@Injectable('createProductCommand', 'productService', 'payload')
export class CreateProductCommand extends Command<
  CreateProductCommandPayload,
  IProduct
> {
  private _productService: IProductService;

  constructor(
    productService: IProductService,
    payload: CreateProductCommandPayload,
  ) {
    super(payload);
    this._productService = productService;
  }

  async execute(): Promise<void> {
    this.result = await this._productService.createProduct(
      this._payload.product,
      this._payload.productImages,
    );
  }
}

import { IProductService } from '@/abstractions';
import { IIdOmitter } from '@/lib/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { EditProductCommandPayload, IProduct } from '@/models';

@Injectable('editProductCommand', 'productService', 'idOmitter', 'payload')
export class EditProductCommand extends Command<
  EditProductCommandPayload,
  IProduct
> {
  private _productService: IProductService;

  private _idOmitter: IIdOmitter;

  constructor(
    productService: IProductService,
    idOmitter: IIdOmitter,
    payload: EditProductCommandPayload,
  ) {
    super(payload);
    this._productService = productService;
    this._idOmitter = idOmitter;
  }

  async execute(): Promise<void> {
    const productWithoutId = this._idOmitter.omitId<IProduct>(
      this._payload.product,
    );
    this.result = await this._productService.editProduct(
      this._payload.productId,
      productWithoutId,
      this._payload.productImages,
    );
  }
}

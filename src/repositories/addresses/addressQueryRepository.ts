import { AddressDto } from '@/models';
import { IDatabaseClient, IFactory, IIdOmitter } from '@/lib/abstractions';
import { IAddressQueryRepository } from '@/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { DatabaseQueryRepository } from '@/lib/repositories/databaseQueryRepository';

@Injectable('addressQueryRepository', 'databaseClientFactory', 'idOmitter')
export class AddressDatabaseQueryRepository
  extends DatabaseQueryRepository<AddressDto>
  implements IAddressQueryRepository
{
  private _idOmitter: IIdOmitter;

  constructor(
    databaseClientFactory: IFactory<Promise<IDatabaseClient>>,
    idOmitter: IIdOmitter,
  ) {
    super(databaseClientFactory, 'addresses');
    this._idOmitter = idOmitter;
  }

  public async getExistingAddress(
    address: AddressDto,
  ): Promise<AddressDto | null> {
    const addressWithoutId = this._idOmitter.omitId(address);
    const existingAddress = await this.find(addressWithoutId);

    if (existingAddress.length === 0) {
      return null;
    }

    return existingAddress[0];
  }
}

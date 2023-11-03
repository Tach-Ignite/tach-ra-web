import { IIdOmitter } from '@/lib/abstractions';
import { Command } from '@/lib/commands';
import { AddUserAddressPayload, IAddress, IUserAddress } from '@/models';
import { IUserAddressService } from '@/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'addUserAddressCommand',
  'userAddressService',
  'idOmitter',
  'payload',
)
export class AddUserAddressCommand extends Command<
  AddUserAddressPayload,
  IUserAddress
> {
  private _userAddressService: IUserAddressService;

  private _idOmitter: IIdOmitter;

  constructor(
    userAddressService: IUserAddressService,
    idOmitter: IIdOmitter,
    payload: AddUserAddressPayload,
  ) {
    super(payload);
    this._userAddressService = userAddressService;
    this._idOmitter = idOmitter;
  }

  async execute(): Promise<void> {
    const addressWithoutId = this._idOmitter.omitId<IAddress>(
      this._payload.userAddress.address,
    );
    this.result = await this._userAddressService.addUserAddress(
      this._payload.userId,
      addressWithoutId,
      this._payload.userAddress.recipientName,
      this._payload.setAsDefault,
    );
  }
}

import { IIdOmitter } from '@/lib/abstractions';
import { Command } from '@/lib/commands';
import { IUserAddress, EditUserAddressCommandPayload } from '@/models';
import { IUserAddressService } from '@/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'editUserAddressCommand',
  'userAddressService',
  'idOmitter',
  'payload',
)
export class EditUserAddressCommand extends Command<
  EditUserAddressCommandPayload,
  IUserAddress
> {
  private _userAddressService: IUserAddressService;

  private _idOmitter: IIdOmitter;

  constructor(
    userAddressService: IUserAddressService,
    idOmitter: IIdOmitter,
    payload: EditUserAddressCommandPayload,
  ) {
    super(payload);
    this._userAddressService = userAddressService;
    this._idOmitter = idOmitter;
  }

  async execute(): Promise<void> {
    const addressWithoutId = this._idOmitter.omitId(
      this._payload.userAddress.address,
    );
    this.result = await this._userAddressService.editUserAddress(
      this._payload.userId,
      this._payload.userAddressId,
      addressWithoutId,
      this._payload.userAddress.recipientName,
      this._payload.setAsDefault,
    );
  }
}

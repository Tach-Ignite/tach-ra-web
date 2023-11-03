import { Command } from '@/lib/commands';
import { IUserAddressService } from '@/abstractions';
import {
  EditUserAddressCommandPayload,
  DeleteUserAddressPayload,
} from '@/models';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('deleteUserAddressCommand', 'userAddressService', 'payload')
export class DeleteUserAddressCommand extends Command<
  DeleteUserAddressPayload,
  void
> {
  private _userAddressService: IUserAddressService;

  constructor(
    userAddressService: IUserAddressService,
    payload: EditUserAddressCommandPayload,
  ) {
    super(payload);
    this._userAddressService = userAddressService;
  }

  async execute(): Promise<void> {
    await this._userAddressService.deleteUserAddress(
      this._payload.userId,
      this._payload.userAddressId,
    );
  }
}

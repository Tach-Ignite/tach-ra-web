import { IUserService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { VerifyEmailAddressCommandPayload } from '@/models';

@Injectable('verifyEmailAddressCommand', 'userService', 'payload')
export class VerifyEmailAddressCommand extends Command<
  VerifyEmailAddressCommandPayload,
  void
> {
  private _userService: IUserService;

  constructor(
    userService: IUserService,
    payload: VerifyEmailAddressCommandPayload,
  ) {
    super(payload);
    this._userService = userService;
  }

  async execute(): Promise<void> {
    await this._userService.verifyEmailAddress(this._payload.token);
  }
}

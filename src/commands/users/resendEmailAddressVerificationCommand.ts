import { IUserService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { ResendEmailAddressVerificationCommandPayload } from '@/models';

@Injectable('resendEmailAddressVerificationCommand', 'userService', 'payload')
export class ResendEmailAddressVerificationCommand extends Command<
  ResendEmailAddressVerificationCommandPayload,
  void
> {
  private _userService: IUserService;

  constructor(
    userService: IUserService,
    payload: ResendEmailAddressVerificationCommandPayload,
  ) {
    super(payload);
    this._userService = userService;
  }

  async execute(): Promise<void> {
    await this._userService.resendEmailAddressVerification(this._payload.token);
  }
}

import { IUserService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { SendPasswordResetRequestCommandPayload } from '@/models';

@Injectable('sendPasswordResetRequestCommand', 'userService', 'payload')
export class SendPasswordResetRequestCommand extends Command<
  SendPasswordResetRequestCommandPayload,
  void
> {
  private _userService: IUserService;

  constructor(
    userService: IUserService,
    payload: SendPasswordResetRequestCommandPayload,
  ) {
    super(payload);
    this._userService = userService;
  }

  async execute(): Promise<void> {
    await this._userService.sendPasswordResetRequest(this._payload.email);
  }
}

import { IUserService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { ResetPasswordCommandPayload } from '@/models';

@Injectable('resetPasswordCommand', 'userService', 'payload')
export class ResetPasswordCommand extends Command<
  ResetPasswordCommandPayload,
  void
> {
  private _userService: IUserService;

  constructor(userService: IUserService, payload: ResetPasswordCommandPayload) {
    super(payload);
    this._userService = userService;
  }

  async execute(): Promise<void> {
    await this._userService.resetPassword(
      this._payload.email,
      this._payload.token,
      this._payload.password,
      this._payload.confirmPassword,
    );
  }
}

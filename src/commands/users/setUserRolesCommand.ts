import { IUserService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { IUser, SetUserRolesCommandPayload } from '@/models';

@Injectable('setUserRolesCommand', 'userService', 'payload')
export class SetUserRolesCommand extends Command<
  SetUserRolesCommandPayload,
  IUser
> {
  private _userService: IUserService;

  constructor(userService: IUserService, payload: SetUserRolesCommandPayload) {
    super(payload);
    this._userService = userService;
  }

  async execute(): Promise<void> {
    this.result = await this._userService.setUserRoles(
      this._payload.userId,
      this._payload.roles,
    );
  }
}

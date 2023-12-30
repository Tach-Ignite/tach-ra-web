import { IUserService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc';
import { IUser, SetUserProfileCommandPayload } from '@/models';

@Injectable('setUserProfileCommand', 'userService', 'payload')
export class SetUserProfileCommand extends Command<
  SetUserProfileCommandPayload,
  IUser
> {
  private _userService: IUserService;

  constructor(
    userService: IUserService,
    payload: SetUserProfileCommandPayload,
  ) {
    super(payload);

    this._userService = userService;
  }

  async execute(): Promise<void> {
    this.result = await this._userService.editUser(this._payload.userId, {
      name: this._payload.name,
      phoneNumber: this._payload.phoneNumber,
      agreedToReceiveSmsNotifications:
        this._payload.agreedToReceiveSmsNotifications,
    });
  }
}

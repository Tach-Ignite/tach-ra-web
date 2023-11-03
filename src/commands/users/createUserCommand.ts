import { IUserService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { CreateUserCommandPayload, IUser } from '@/models';

@Injectable('createUserCommand', 'userService', 'payload')
export class CreateUserCommand extends Command<
  CreateUserCommandPayload,
  IUser
> {
  private _userService: IUserService;

  constructor(userService: IUserService, payload: CreateUserCommandPayload) {
    super(payload);
    this._userService = userService;
  }

  async execute(): Promise<void> {
    this.result = await this._userService.createUser(
      this._payload.user,
      this._payload.password,
    );
  }
}

import { IUser } from '../../../domain/user';

export type CreateUserCommandPayload = {
  user: IUser;
  password: string;
};

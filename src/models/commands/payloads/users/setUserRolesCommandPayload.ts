import { IUserRolesEnum } from '../../../enums/userEnums';

export type SetUserRolesCommandPayload = {
  userId: string;
  roles: Extract<keyof IUserRolesEnum, string>[];
};

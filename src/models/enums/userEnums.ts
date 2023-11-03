import { IEnum } from '@/lib/abstractions';
import { EnumFactory } from '@/lib/enums';

const enumFactory = new EnumFactory();

export interface IUserRolesEnum extends IEnum {
  Admin: string;
  SomeOtherRole: string;
}

export const UserRolesEnum: IUserRolesEnum = enumFactory.create({
  Admin: 'Admin',
  SomeOtherRole: 'Some Other Role',
}) as IUserRolesEnum;

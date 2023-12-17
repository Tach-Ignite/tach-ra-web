import { IUser, IUserRolesEnum } from '@/models';

export interface IUserService {
  createUser(user: IUser, password: string): Promise<IUser>;
  editUser(userId: string, user: Partial<IUser>): Promise<IUser>;
  getUserById(userId: string): Promise<IUser>;
  getUserByPhoneNumber(phoneNumber: string): Promise<IUser>;
  getAllUsers(): Promise<IUser[]>;
  resendEmailAddressVerification(token: string): Promise<void>;
  sendPasswordResetRequest(email: string): Promise<void>;
  resetPassword(
    email: string,
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<void>;
  verifyEmailAddress(token: string): Promise<void>;
  setUserRoles(
    userId: string,
    roles: Extract<keyof IUserRolesEnum, string>[],
  ): Promise<IUser>;
}

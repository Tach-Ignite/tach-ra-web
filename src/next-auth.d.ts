import { IUserRolesEnum, IUser } from '@/models';

declare module 'next-auth/client';

declare module 'next-auth' {
  interface User extends IUser {
    _id: string;
    email: string;
    emailVerified: Date | null;
    password: string;
  }
  interface Session {
    user: User;
  }
  interface UserAddress extends IUserAddress {}
}

declare module 'next-auth/jwt' {
  interface JWT {}
}

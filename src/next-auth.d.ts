import { IUserRolesEnum } from './models';

declare module 'next-auth/client';

declare module 'next-auth' {
  interface User {
    _id: string;
    password: string;
    email: string;
    name: string;
    image: string;
    emailVerified: Date;
    roles: Extract<keyof IUserRolesEnum, string>[];
    defaultUserAddressId: string;
    addresses: UserAddress[];
  }
  interface Session {
    user: User;
  }
  interface UserAddress extends IUserAddress {}
}

declare module 'next-auth/jwt' {
  interface JWT {}
}

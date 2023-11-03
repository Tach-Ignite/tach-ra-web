# Authentication

This RA utilizes NextAuth to provide authentication capabilities. Our specific implementation allows for a database-provided credentials provider, along with the following OAuth providers:

- Google
- Azure AD
- GitHub
- LinkedIn

for more information on setting up external dependencies, see [Configuring External Dependencies](/docs/configuring_external_dependencies.md).

## Role-Based Access Control (RBAC)

The RA provides role-based access control throughout the application. There are two main components to this capability: `IServerIdentity` and `RouteProtector`.

## APIs & other Non-React Use Cases: Server Identity RBAC Example

The `IServerIdentity` allows you to check roles along with some other user management features on the server side, both in APIs and other server-side use cases.

```javascript
import { ModuleResolver } from '@/lib/ioc';
import { IServerIdentity } from '@/lib/auth/nextAuth';
import { UserRolesEnum } from '@/models';
import { MyModule } from '@/modules/my.module';

const m = new ModuleResolver().resolve(MyModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
...
if (serverIdentity.hasRole(UserRolesEnum.reverseLookup(UserRolesEnum.Admin))) {
  // do something
}
```

## React Components & Pages: RouteProtector RBAC Example

The `RouteProtector` allows you to restrict a route to a specific role. If the user does not have the role, they will recieve a 404 error. The `ProtectedRouteLayout` wraps the `RouteProtector` in the demo app.

```jsx
import { RouteProtector } from '@/lib/auth/nextAuth';
...
Page.getLayout = function getLayout(page: ReactElement, session: Session) {
  return (
    <RootLayout session={session}>
      <ProtectedRouteLayout allowedRole={UserRolesEnum.Admin}>
        <AdminLayout>{page}</AdminLayout>
      </ProtectedRouteLayout>
    </RootLayout>
  );
};

export default Page;
```

## Known Issues

Currently API Routes within the App Router do not provide to NextApiRequest and NextApiResponse objects. Because the NextAuthOptionsFactory requires these objects to retrieve and set cookies, we cannot use the NextAuthOptionsFactory in the App Router. As a result, the NextAuth API routes must utilize the Pages Router.

This also has the side effect of making getting the server session using out-of-the-box NextAuth capabilities a little clunky. We need to pass empty objects in place of the NextApiRequest and NextApiResponseParameters. While this doesn't throw any errors, it also means that cookies will not work as intended for that session, and there also may be other behavioral quirks:

```jsx
import { IAuthOptionsFactory } from '@/lib/auth/nextAuth';
import { ModuleResolver } from '@/lib/ioc';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { NextAuthModule } from '@/lib/modules/auth/nextAuth/nextAuth.module';

export default async function Page() {
  const authOptions = new ModuleResolver()
    .resolve(NextAuthModule)
    .resolve<IAuthOptionsFactory>('authOptionsFactory')
    .create({} as NextApiRequest, {} as NextApiResponse);
  const session = await getServerSession(authOptions);
...
}

```

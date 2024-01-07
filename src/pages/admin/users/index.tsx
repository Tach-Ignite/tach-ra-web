import { ReactElement } from 'react';
import { Session } from 'next-auth';
import { AdminLayout, UsersList } from '@/components/admin';
import { ProtectedRouteLayout, RootLayout } from '@/components';
import { IUser, UserViewModel, UserRolesEnum } from '@/models';
import { IUserService } from '@/abstractions';
import { IMapper, IProvider, IServerIdentity } from '@/lib/abstractions';
import '@/mappingProfiles/pages/admin/users/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { AdminUsersModule } from '@/modules/pages/admin/users/adminUsers.module';

type UsersAdminPageProps = {
  users: UserViewModel[];
};

function UsersAdminPage({ users }: UsersAdminPageProps) {
  return (
    <>
      <h1 className="text-xl mb-4">Users</h1>
      <UsersList users={users} />
    </>
  );
}

UsersAdminPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  return (
    <RootLayout session={session}>
      <ProtectedRouteLayout allowedRole={UserRolesEnum.Admin}>
        <AdminLayout>{page}</AdminLayout>
      </ProtectedRouteLayout>
    </RootLayout>
  );
};

export async function getServerSideProps({ req, res }: any) {
  try {
    const m = new ModuleResolver().resolve(AdminUsersModule);
    const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');

    const userIsAdmin = await serverIdentity.userHasRole(
      req,
      res,
      UserRolesEnum.reverseLookup(UserRolesEnum.Admin),
    );

    if (!userIsAdmin) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const userService = m.resolve<IUserService>('userService');
    const automapperProvider =
      m.resolve<IProvider<IMapper>>('automapperProvider');

    const users = await userService.getAllUsers();

    const mapper = automapperProvider.provide();

    const userViewModels = mapper.mapArray<IUser, UserViewModel>(
      users,
      'IUser',
      'UserViewModel',
    );

    const cleansedUserViewModels = JSON.parse(
      JSON.stringify(userViewModels),
    ) as UserViewModel[];

    return {
      props: { users: cleansedUserViewModels },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { users: [] },
    };
  }
}

export default UsersAdminPage;

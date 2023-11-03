import { ReactElement } from 'react';
import { Session } from 'next-auth';
import { ProtectedRouteLayout, RootLayout } from '@/components';
import { AdminLayout } from '@/components/admin';
import { UserRolesEnum } from '@/models';

function AdminDashboardPage() {
  return <div>AdminDashboardPage</div>;
}

AdminDashboardPage.getLayout = function getLayout(
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

export default AdminDashboardPage;

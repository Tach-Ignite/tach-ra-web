import { ReactElement } from 'react';
import { Session } from 'next-auth';
import { ProtectedRouteLayout, RootLayout } from '@/components';
import { AdminLayout } from '@/components/admin';
import { UserRolesEnum } from '@/models';

function AdminSettingsPage() {
  return <div className="">AdminSettingsPage</div>;
}

AdminSettingsPage.getLayout = function getLayout(
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

export default AdminSettingsPage;

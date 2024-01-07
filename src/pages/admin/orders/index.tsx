import { ReactElement } from 'react';
import { Session } from 'next-auth';
import { AdminLayout, OrdersList } from '@/components/admin';
import { ProtectedRouteLayout, RootLayout } from '@/components';
import { IOrderService } from '@/abstractions';
import { IMapper, IProvider, IServerIdentity } from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { IOrder, OrderViewModel, UserRolesEnum } from '@/models';
import '@/mappingProfiles/pages/admin/orders/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { AdminOrdersModule } from '@/modules/pages/admin/orders/adminOrders.module';

type OrdersAdminPageProps = {
  orders: OrderViewModel[];
};

function OrdersAdminPage({ orders }: OrdersAdminPageProps) {
  return (
    <>
      <h1 className="text-xl mb-4">Orders</h1>
      <OrdersList orders={orders} />
    </>
  );
}

OrdersAdminPage.getLayout = function getLayout(
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

export async function getServerSideProps(context: any) {
  try {
    const m = new ModuleResolver().resolve(AdminOrdersModule);
    const orderService = m.resolve<IOrderService>('orderService');
    const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
    const automapperProvider =
      m.resolve<IProvider<IMapper>>('automapperProvider');
    const user = await serverIdentity.getUser(context.req, context.res);

    if (!user) {
      throw new ErrorWithStatusCode('User is not authenticated', 401);
    }

    const userIsAdmin = await serverIdentity.userHasRole(
      context.req,
      context.res,
      UserRolesEnum.reverseLookup(UserRolesEnum.Admin),
    );

    if (!userIsAdmin) {
      throw new ErrorWithStatusCode('User is not authorized', 403);
    }

    const orders = await orderService.getAllOrders();

    const mapper = automapperProvider.provide();
    const orderViewModels = mapper.mapArray<IOrder, OrderViewModel>(
      orders,
      'IOrder',
      'OrderViewModel',
    );
    const cleansedOrderViewModels = JSON.parse(JSON.stringify(orderViewModels));

    return {
      props: { orders: cleansedOrderViewModels },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { orders: [] },
    };
  }
}

export default OrdersAdminPage;

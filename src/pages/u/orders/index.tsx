import React, { ReactElement } from 'react';
import { Session } from 'next-auth';
import { CenterContainer, MyOrdersList, RootLayout } from '@/components';
import { IOrderService } from '@/abstractions';
import { IMapper, IProvider, IServerIdentity } from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { IOrder, OrderViewModel } from '@/models';
import '@/mappingProfiles/pages/u/orders/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { UserOrdersModule } from '@/modules/pages/u/orders/userOrders.module';

export type MyOrdersPageProps = {
  orders: OrderViewModel[];
};

function MyOrdersPage({ orders }: MyOrdersPageProps) {
  return (
    <>
      <h1 className="text-xl mb-4">My Orders</h1>
      {orders && orders.length > 0 ? (
        <MyOrdersList orders={orders} />
      ) : (
        <div>You haven&apos;t ordered anything yet.</div>
      )}
    </>
  );
}

MyOrdersPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  return (
    <RootLayout session={session}>
      <CenterContainer>{page}</CenterContainer>
    </RootLayout>
  );
};

export async function getServerSideProps(context: any) {
  const m = new ModuleResolver().resolve(UserOrdersModule);
  const orderService = m.resolve<IOrderService>('orderService');
  const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
  const automapperProvider =
    m.resolve<IProvider<IMapper>>('automapperProvider');
  const user = await serverIdentity.getUser(context.req, context.res);

  if (!user) {
    throw new ErrorWithStatusCode('User is not authenticated', 401);
  }

  const orders = await orderService.getAllOrdersByUserId(user._id);

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
}

export default MyOrdersPage;

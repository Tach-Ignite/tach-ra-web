import { ajvResolver } from '@hookform/resolvers/ajv';
import { useRouter } from 'next/router';
import { BaseSyntheticEvent, ReactElement, useState } from 'react';
import { Session } from 'next-auth';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin';
import { Button, ProtectedRouteLayout, RootLayout } from '@/components';
import { useEditOrderMutation } from '@/rtk';
import {
  IOrder,
  OrderViewModel,
  UpdateOrderStatusViewModel,
  updateOrderStatusViewModelSchema,
  UserRolesEnum,
  OrderStatusEnum,
} from '@/models';
import { IOrderService } from '@/abstractions';
import { IMapper, IProvider, IServerIdentity } from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import '@/mappingProfiles/pages/admin/orders/mappingProfile';
import { PaymentStatusEnum } from '@/lib/enums';
import { ModuleResolver } from '@/lib/ioc/';
import { AdminOrdersModule } from '@/modules/pages/admin/orders/adminOrders.module';

type EditOrderAdminPageProps = {
  order: OrderViewModel;
};

function EditOrderAdminPage({ order }: EditOrderAdminPageProps) {
  const router = useRouter();
  const id = router.query.id as string;
  const { _id, user, userAddress, lineItems, paymentStatus } = order;

  const [submitError, setSubmitError] = useState<string>('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [editOrder, editOrderResult] = useEditOrderMutation();

  const labelClassName = 'text-tachGrey text-sm mb-1';
  const fieldGroupClassName = 'flex flex-col justify-center flex-wrap';
  const dataClassName = 'xl:h-16 text-sm';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateOrderStatusViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(updateOrderStatusViewModelSchema, { $data: true }),
    defaultValues: {
      orderStatus: order.orderStatus,
    },
  });

  function onSubmitHandler(
    data: UpdateOrderStatusViewModel,
    event: BaseSyntheticEvent<object, any, any> | undefined,
  ) {
    event!.preventDefault();
    setSendingRequest(true);
    editOrder({ orderId: _id, updateOrderStatusViewModel: data })
      .then((result: any) => {
        router.push('/admin/orders');
      })
      .catch((error: any) => {
        setSubmitError(error.toString());
        setSendingRequest(false);
      });
  }

  return (
    <>
      <h1 className="text-xl mb-4">
        <Link
          href="/admin/orders"
          className="hover:text-tachPurple duration-300 underline underline-offset-4 duration-300"
        >
          Orders
        </Link>{' '}
        &gt; Edit
      </h1>
      <div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-3 text-base">
          <div className={`${fieldGroupClassName}`}>
            <p className={labelClassName}>Recipient Name</p>
            <p className={dataClassName}>{user.name}</p>
          </div>
          <div className={fieldGroupClassName}>
            <p className={labelClassName}>Recipient Email</p>
            <p className={dataClassName}>{user.email}</p>
          </div>
          <div className={fieldGroupClassName}>
            <p className={labelClassName}>Address</p>
            <p className={dataClassName}>
              {userAddress?.address && (
                <>
                  <div>{userAddress.address.lineOne}</div>
                  <div>{userAddress.address.lineTwo}</div>
                  <div>
                    {userAddress.address.city}, {userAddress.address.state}
                  </div>
                  <div>
                    {userAddress.address.postalCode}{' '}
                    {userAddress.address.country}
                  </div>
                </>
              )}
            </p>
          </div>

          <div className={fieldGroupClassName}>
            <p className={labelClassName}>Payment Status</p>
            <p
              className={`${dataClassName} ${
                paymentStatus ===
                PaymentStatusEnum.reverseLookup(PaymentStatusEnum.Paid)
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {paymentStatus}
            </p>
          </div>
        </div>
      </div>
      <div className="">
        <p className="text-lg mb-2">Line Items</p>
        <div className="flex gap-3">
          <div className="basis-5/6">
            <div className={labelClassName}>Product</div>
          </div>
          <div>
            <div className={labelClassName}>Quantity</div>
          </div>
        </div>
        <hr className="mb-2" />
        <p className="">
          {lineItems.map((li) => (
            <div key={li.priceData.productData._id} className="flex gap-3 mb-2">
              <div className="flex text-sm text-ellipsis overflow-hidden basis-5/6">
                {li.priceData.productData.name}
              </div>
              <div>{li.quantity}</div>
            </div>
          ))}
        </p>
      </div>
      <div className="mt-8">
        <form>
          <div className={fieldGroupClassName}>
            <label className={labelClassName} htmlFor={_id}>
              Order Status
            </label>
            <select
              id={_id}
              {...register('orderStatus')}
              className="max-w-xs border-tachGrey outline-none focus-visible:border-tachGreen border rounded py-1 px-1.5 transition duration-300"
            >
              {OrderStatusEnum._keys.map((key) => (
                <option key={key} value={key}>
                  {OrderStatusEnum[key]}
                </option>
              ))}
            </select>
          </div>
          <Button
            className="bg-orange-600 mt-4"
            onClick={handleSubmit(onSubmitHandler)}
            isLoading={sendingRequest}
          >
            Save Changes
          </Button>
          <div className="text-red-600">{submitError}</div>
          <div className="text-red-600">{errors.root?.message}</div>
        </form>
      </div>
    </>
  );
}

EditOrderAdminPage.getLayout = function getLayout(
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

export async function getServerSideProps({ query, req, res }: any) {
  const m = new ModuleResolver().resolve(AdminOrdersModule);
  const orderService = m.resolve<IOrderService>('orderService');
  const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
  const automapperProvider =
    m.resolve<IProvider<IMapper>>('automapperProvider');
  const user = await serverIdentity.getUser(req, res);

  if (!user) {
    throw new ErrorWithStatusCode('User is not authenticated', 401);
  }

  const userIsAdmin = await serverIdentity.userHasRole(
    req,
    res,
    UserRolesEnum.reverseLookup(UserRolesEnum.Admin),
  );

  if (!userIsAdmin) {
    throw new ErrorWithStatusCode('User is not authorized', 403);
  }

  const order = await orderService.getOrderById(query.id);

  const mapper = automapperProvider.provide();
  const orderViewModel = mapper.map<IOrder, OrderViewModel>(
    order,
    'IOrder',
    'OrderViewModel',
  );
  const cleansedOrderViewModel = JSON.parse(JSON.stringify(orderViewModel));

  return {
    props: { order: cleansedOrderViewModel },
  };
}

export default EditOrderAdminPage;

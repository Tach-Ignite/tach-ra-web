import Link from 'next/link';
import { HiOutlinePencil } from 'react-icons/hi2';
import { OrderViewModel } from '@/models';
import { PaymentStatusEnum } from '@/lib/enums';
import { Price } from '../../price';

export type OrdersListProps = {
  orders: OrderViewModel[];
};

export function OrdersList({ orders }: OrdersListProps) {
  const labelClassname = 'text-tachGrey text-xs ';
  const fieldGroupClassname = 'flex flex-col justify-center flex-wrap';
  const linkClassname =
    'flex hover:text-tachPurple duration-300 underline underline-offset-4';
  const dataClassName = 'xl:h-16 text-sm ellipsis overflow-hidden';
  return (
    <div className="md:grid sm:grid-cols-2 xl:block md:gap-3">
      {orders.map((order: OrderViewModel) => {
        const {
          _id,
          user,
          userAddress,
          lineItems: line_items,
          paymentStatus: payment_status,
          orderStatus,
          createdAt,
        } = order;
        return (
          <div
            key={_id}
            className="border border-tachGrey rounded px-4 py-3 mt-4 shadow-md shadow-tachDark/10 dark:shadow-white/10"
          >
            <div className="grid grid-cols-1 xl:grid-cols-9 gap-3 text-base">
              <div className={`${fieldGroupClassname}`}>
                <p className={labelClassname}>Order Placed</p>
                <p className={dataClassName}>
                  {new Date(createdAt).toLocaleString()}
                </p>
              </div>
              <div className={`${fieldGroupClassname} col-span-2`}>
                <p className={labelClassname}>Recipient Email</p>
                <p className={dataClassName}>{user.email}</p>
              </div>
              <div className={`${fieldGroupClassname} col-span-2`}>
                <p className={labelClassname}>Address</p>
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
              <div className={fieldGroupClassname}>
                <p className={labelClassname}>Total</p>
                <p className={dataClassName}>
                  <Price
                    amount={line_items.reduce(
                      (a, b) => a + b.priceData.unitAmount * b.quantity,
                      0,
                    )}
                  />
                </p>
              </div>
              <div className={fieldGroupClassname}>
                <p className={labelClassname}>Payment Status</p>
                <p
                  className={`${dataClassName} ${
                    payment_status ===
                    PaymentStatusEnum.reverseLookup(PaymentStatusEnum.Paid)
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {payment_status}
                </p>
              </div>
              <div className={fieldGroupClassname}>
                <p className={labelClassname}>Order Status</p>
                <p className={`${dataClassName}`}>{orderStatus}</p>
              </div>
              <Link
                className={linkClassname}
                href={`/admin/orders/edit/${_id}`}
              >
                <HiOutlinePencil className="w-5 h-5 mr-1" />
                Edit
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

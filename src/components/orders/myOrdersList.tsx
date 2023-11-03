import { OrderViewModel } from '@/models';
import { Price } from '../price';

export type MyOrdersListProps = {
  orders: OrderViewModel[];
};

export function MyOrdersList({ orders }: MyOrdersListProps) {
  const labelClassname = 'text-gray-600 text-xs ';
  const fieldGroupClassname = '';
  const dataClassName = 'text-sm';
  return (
    <div className="w-full flex flex-col gap-3">
      {orders.map((order: OrderViewModel) => {
        const { _id, userAddress, lineItems, createdAt } = order;
        return (
          <div
            key={_id}
            className="border border-tachGrey rounded p-3 shadow-md"
          >
            <div className="flex gap-6 flex-wrap mb-2">
              <div className={`${fieldGroupClassname}`}>
                <p className={labelClassname}>Date Placed</p>
                <p className={dataClassName}>
                  {new Date(createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className={labelClassname}>Total</p>
                <p className={dataClassName}>
                  <Price
                    amount={lineItems.reduce(
                      (a, b) => a + b.priceData.unitAmount * b.quantity,
                      0,
                    )}
                  />
                </p>
              </div>
              <div className={fieldGroupClassname}>
                <p className={labelClassname}>Ship To</p>
                <p className={`${dataClassName} text-ellipsis`}>
                  {userAddress && (
                    <div className="flex gap-1">
                      <div>{userAddress.address.lineOne},</div>
                      <div>
                        {userAddress.address.lineTwo &&
                          `${userAddress.address.lineTwo},`}
                      </div>
                      <div>
                        {userAddress.address.city}, {userAddress.address.state}
                      </div>
                      <div>
                        {userAddress.address.postalCode}{' '}
                        {userAddress.address.country}
                      </div>
                    </div>
                  )}
                </p>
              </div>
            </div>
            <hr />
            <div className="mt-2">
              <div className={fieldGroupClassname}>
                <div className="text-xl font-semibold mb-2">
                  Status: {order.orderStatus}
                </div>
                <div className="flex flex-col gap-3">
                  {lineItems.map((li) => (
                    <div
                      key={li.priceData.productData._id}
                      className="flex flex-col md:flex-row gap-3"
                    >
                      {li.priceData.productData.imageUrls.length > 0 && (
                        <img
                          src={li.priceData.productData.imageUrls[0] ?? ''}
                          alt={li.priceData.productData.name ?? 'Order Image'}
                          width={100}
                          height={100}
                          className="object-cover self-center w-[100px] h-[100px] flex-none rounded"
                        />
                      )}
                      <div>
                        <div className="text-md mb-1">
                          {li.priceData.productData.name}
                        </div>
                        <div className="text-sm">
                          {li.priceData.productData.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

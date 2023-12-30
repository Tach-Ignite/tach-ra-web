import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  CartPayment,
  CartListItem,
  ClearCart,
  CaptureAddress,
} from '@/components';
import { useGetCartQuery } from '@/rtk/apis/cartApi';

function CartPage() {
  const { status } = useSession();
  const { data: cart, isLoading: cartIsLoading } = useGetCartQuery();

  return (
    <div>
      {cart && cart.items.length > 0 ? (
        <div className="px-6 flex flex-col md:flex-row gap-6 py-4">
          <div>
            <div className="flex items-center flex-col lg:flex-row justify-between border-b border-tachGrey pb-1">
              <p className="text-2xl font-semibold">Shopping Cart</p>
              <p className="text-lg font-semibold">Subtitle</p>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              {cart.items.map((cartItem) => (
                <div
                  key={cartItem.product._id}
                  className="pt-2 flex flex-col gap-3"
                >
                  <CartListItem cartItem={cartItem} />
                </div>
              ))}
              <ClearCart />
            </div>
          </div>
          <div>
            <div className="flex-none w-full md:w-[300px] cold-span-1 p-4 rounded flex flex-col gap-y-4 border border-tachGrey">
              {status === 'authenticated' && <CaptureAddress />}
              <CartPayment />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 col-span-5 flex flex-col items-center justify-center py-5 rounded shadow-lg">
          <h1 className="text-lg font-medium mb-4">Your cart is empty.</h1>
          <Link href="/">
            <button
              type="button"
              className="w-52 h-10 rounded text-sm font-semibold bg-tachGrey text-white hover:bg-tachPurple duration-300"
            >
              Shop Great Deals
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartPage;

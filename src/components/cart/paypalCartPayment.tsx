import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { RootState } from '@/rtk';
import { useGetCartQuery } from '@/rtk/apis/cartApi';
import { Price } from '../price';

export function PayPalCartPayment() {
  const { status } = useSession();
  const router = useRouter();
  const { data: cart, isLoading: cartIsLoading } = useGetCartQuery();
  const [totalPrice, setTotalPrice] = useState(0);
  const [{ isPending }] = usePayPalScriptReducer();
  const { userAddress } = useSelector((state: RootState) => state.userAddress);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/checkout`;

  useEffect(() => {
    if (cartIsLoading || !cart) {
      return;
    }

    let total = 0;
    cart.items.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    setTotalPrice(total);
  }, [cart, setTotalPrice, cartIsLoading]);

  const createOrder = useCallback((): Promise<string> => {
    if (status === 'authenticated' && userAddress) {
      return fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: userAddress }),
      })
        .then((response) => response.json())
        .then((order) => order.id);
    }
    throw new Error('User is not authenticated');
  }, [status, userAddress, apiUrl]);

  const onApprove = useCallback(
    (data: any) =>
      fetch(`${apiUrl}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data,
        }),
      }).then((response) => {
        if (response && response.ok) {
          router.push('/checkout/success');
        }
      }),
    [apiUrl, router],
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center justify-between px-2 font-semibold">
        Total:{' '}
        <span className="font-bold text-xl">
          <Price amount={totalPrice} />
        </span>
      </p>
      <div className="flex flex-col items-center">
        {(isPending || status === 'loading') && <p>Loading...</p>}
        {!isPending && status === 'authenticated' && userAddress && (
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            forceReRender={[userAddress]}
          />
        )}
        {status === 'unauthenticated' && (
          <Link
            href={{
              pathname: '/auth/register',
              query: { returnUrl: router.asPath },
            }}
            className="text-sm mt-2 text-red-600 font-semibold underline cursor-pointer"
          >
            Please log in to continue.
          </Link>
        )}
        {status === 'authenticated' && !userAddress && (
          <p>Please add an address above.</p>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { RootState } from '@/rtk';
import { CheckoutViewModel } from '@/models';
import { useGetCartQuery } from '@/rtk/apis/cartApi';
import { Price } from '../price';

export function StripeCartPayment() {
  const { status } = useSession();
  const router = useRouter();
  const { data: cart, isLoading: cartIsLoading } = useGetCartQuery();
  const { userAddress } = useSelector((state: RootState) => state.userAddress);
  const [totalPrice, setTotalPrice] = useState(0);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  );

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

  async function paymentHandler() {
    if (status === 'authenticated') {
      const stripe = await stripePromise;
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/checkout`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
        } as CheckoutViewModel),
      });
      if (response.status !== 200) {
        alert('Something went wrong, please try again later.');
        return;
      }
      const checkoutSession = await response.json();
      const result = await stripe!.redirectToCheckout({
        sessionId: checkoutSession.createPaymentIntentResult.checkoutSessionId,
      });
      if (result.error) {
        alert(result.error.message);
      }
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center justify-between px-2 font-semibold">
        Total:{' '}
        <span className="font-bold text-xl">
          <Price amount={totalPrice} />
        </span>
      </p>
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={paymentHandler}
          className={`w-full h-10 text-sm font-semibold bg-tachGrey text-white rounded ${
            (status === 'unauthenticated' || !userAddress) &&
            'cursor-not-allowed bg-opacity-50'
          } ${
            status === 'authenticated' && 'hover:bg-tachPurple duration-300'
          }`}
        >
          Proceed to Payment
        </button>
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
          <p className="text-sm mt-2 text-red-600 font-semibold">
            Please add an address above.
          </p>
        )}
      </div>
    </div>
  );
}

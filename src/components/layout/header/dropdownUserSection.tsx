import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/rtk';

export function DropdownUserSection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const numberOfItemsInCart = useSelector(
    (state: RootState) => state.cart.cartItems.length,
  );

  return (
    <>
      {status === 'unauthenticated' && (
        <>
          <Link
            href={{
              pathname: '/auth/signIn',
              query: { returnUrl: router.asPath },
            }}
            className="underline underline-offset-4 hover:text-tachPurple transition duration-300"
          >
            <p>Sign In</p>
          </Link>
          <Link
            href={{
              pathname: '/auth/register',
              query: { returnUrl: router.asPath },
            }}
            className="underline underline-offset-4 hover:text-tachPurple transition duration-300"
          >
            <p>Register</p>
          </Link>
        </>
      )}
      {status === 'authenticated' && (
        <>
          <Link
            className="underline underline-offset-4 hover:text-tachPurple transition duration-300"
            href="/u/orders"
          >
            My Orders
          </Link>
          <Link
            className="underline underline-offset-4 hover:text-tachPurple transition duration-300"
            href="/u/favorites"
          >
            My Favorites
          </Link>
          <Link
            className="underline underline-offset-4 hover:text-tachPurple transition duration-300"
            href="/auth/signOut?returnUrl=/"
          >
            Sign Out
          </Link>
        </>
      )}
      <Link
        href="/cart"
        className="underline underline-offset-4 hover:text-tachPurple transition duration-300"
      >
        Cart({numberOfItemsInCart})
      </Link>
    </>
  );
}

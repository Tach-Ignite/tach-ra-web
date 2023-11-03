import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LuMenu } from 'react-icons/lu';
import { UserRolesEnum } from '@/models';

export function BottomHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const menuItem =
    'hidden md:inline-flex items-center gap-1 h-8 border border-transparent hover:border-tachGrey cursor-pointer duration-300 px-2';
  return (
    <div className="w-full h-10 bg-tachGrey text-sm text-white px-4 flex items-center">
      <Link
        href="/p"
        className="flex items-center gap-1 h-8 border border-transparent hover:border-white cursor-pointer duration-300 px-2"
      >
        <LuMenu className="text-xl" /> All
      </Link>
      {/* <p className={menuItem}>Today&apos;s Deals</p> */}
      <Link href="/contact" className={menuItem}>
        Customer Service
      </Link>
      {/* <p className={menuItem}>Registry</p>
      <p className={menuItem}>Gift Cards</p>
      <p className={menuItem}>Sell</p> */}
      {status === 'authenticated' && (
        <Link
          href={{
            pathname: '/auth/signOut',
            query: { returnUrl: router.asPath },
          }}
          className="hidden md:inline-flex items-center gap-1 h-8 border border-transparent hover:border-white cursor-pointer duration-300 px-2 text-tachLime"
        >
          Sign Out
        </Link>
      )}
      {status === 'authenticated' &&
        session.user.roles?.includes(UserRolesEnum.Admin) && (
          <Link
            href={{
              pathname: '/admin',
            }}
            className="hidden md:inline-flex items-center gap-1 h-8 border border-transparent hover:border-white cursor-pointer duration-300 px-2 text-tachLime"
          >
            Admin Console
          </Link>
        )}
      {status === 'unauthenticated' && (
        <Link
          href={{
            pathname: '/auth/register',
            query: { returnUrl: router.asPath },
          }}
          className="hidden md:inline-flex items-center gap-1 h-8 border border-transparent hover:border-white cursor-pointer duration-300 px-2 text-tachLime"
        >
          Register
        </Link>
      )}
    </div>
  );
}

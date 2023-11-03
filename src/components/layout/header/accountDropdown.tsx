import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { BiSolidUpArrow } from 'react-icons/bi';
import { UserRolesEnum } from '@/models';

export function AccountDropdown() {
  const { data: session, status } = useSession();

  return (
    <div>
      <div className="bg-transparent h-4" />
      <BiSolidUpArrow className="absolute text-white dark:text-tachDark top-0 right-4 w-8 h-8" />
      <div className="bg-white dark:bg-tachDark w-48 rounded grid grid-rows-2 gap-3 p-6 text-sm underline">
        {session?.user.roles?.includes(
          UserRolesEnum.reverseLookup(UserRolesEnum.Admin),
        ) && (
          <Link className="hover:text-tachPurple duration-300" href="/admin">
            Admin Console
          </Link>
        )}
        <Link className="hover:text-tachPurple duration-300" href="/u/orders">
          My Orders
        </Link>
        <Link
          className="hover:text-tachPurple duration-300"
          href="/u/favorites"
        >
          My Favorites
        </Link>
        <Link
          className="hover:text-tachPurple duration-300"
          href="/auth/signOut?returnUrl=/"
        >
          Sign Out
        </Link>
      </div>
    </div>
  );
}

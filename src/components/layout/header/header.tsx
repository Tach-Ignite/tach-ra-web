import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IoCartOutline } from 'react-icons/io5';
import { useState } from 'react';
import { HiBars3 } from 'react-icons/hi2';
import { useSession } from 'next-auth/react';
import { RootState } from '@/rtk';
import { DarkModeToggle } from '@/components/darkModeToggle';
import CounterBubble from '../../counterBubble';
import { HeaderLogo } from './logo';
import { SearchBar } from './searchBar';
import { DropdownUserSection } from './dropdownUserSection';
import { UserInfo } from './userInfo';

export function Header() {
  const { status } = useSession();
  const numberOfItemsInCart = useSelector(
    (state: RootState) => state.cart.cartItems.length,
  );
  const [expanded, setExpanded] = useState(false);

  function dropdownClickHandler() {
    setExpanded((prev) => !prev);
  }

  return (
    <>
      <div className="w-full h-20 dark:bg-tachDark bg-white stick top-0 z-50">
        <div className="w-full h-full mx-auto inline-flex items-center justify-between gap-1 gap-3 px-4 border-b border-tachGrey">
          <div className="mr-4">
            <HeaderLogo />
          </div>
          <div className="hidden lg:flex items-center gap-3 text-sm flex-grow">
            <Link
              href="/p"
              className="border border-transparent p-2 hover:border-tachGrey transition duration-300"
            >
              Browse All Products
            </Link>
            <div className="flex-grow">
              <SearchBar />
            </div>
            <UserInfo />
            <Link
              href="/cart"
              className="text-xs flex flex-row justify-center p-2 py-1 border border-transparent dark:hover:border-tachGrey hover:border-tachDark cursor-pointer duration-300 h-[65%] relative"
            >
              <IoCartOutline className="w-14 h-14" />
              <p className="text-xs font-bold flex flex-col items-center justify-center">
                Cart
              </p>
              <div className="absolute left-[31px] top-[8px]">
                <CounterBubble quantity={numberOfItemsInCart} />
              </div>
            </Link>
          </div>
          <div className="flex-grow lg:hidden" />
          <DarkModeToggle />
          <button
            type="button"
            onClick={dropdownClickHandler}
            className="lg:hidden"
          >
            <HiBars3 className="w-8 h-8" />
          </button>
        </div>
      </div>

      <div
        className={`${
          expanded
            ? `${
                status === 'authenticated' ? 'h-340' : 'h-[300px]'
              } border-b border-tachGrey py-4 shadow-lg shadow-tachDark/20 dark:shadow-white/20`
            : 'h-0 overflow-hidden text-transparent'
        } transition-all ease-in-out duration-800 lg:hidden`}
      >
        <div className="lg:hidden mx-4 mt-4 flex flex-col gap-6 pb-4">
          <SearchBar />
          <Link
            href="/p"
            className="underline underline-offset-4 hover:text-tachPurple transition duration-300"
          >
            Browse All Products
          </Link>
          <DropdownUserSection />
        </div>
      </div>
    </>
  );
}

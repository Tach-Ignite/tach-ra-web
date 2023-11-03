import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineCog,
  HiOutlineClipboardDocumentList,
  HiOutlineUsers,
} from 'react-icons/hi2';
import { BiTachometer } from 'react-icons/bi';
import { BsBoxSeam, BsListUl } from 'react-icons/bs';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useState } from 'react';

export function Nav() {
  const router = useRouter();
  const linkClasses =
    'flex items-center gap-3 hover:text-tachPurple underline underline-offset-4 transition duration-300';
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className="p-6 m-4 rounded top-4 lg:sticky border border-tachGrey">
      <div className="flex gap-3 items-center">
        <div onClick={() => setIsExpanded(!isExpanded)} className="md:hidden">
          {isExpanded ? (
            <IoIosArrowUp className="w-8 h-8" />
          ) : (
            <IoIosArrowDown className="w-8 h-8" />
          )}
        </div>
        <Link href="/admin" className={`${linkClasses} text-xl`}>
          <HiOutlineWrenchScrewdriver className="w-8 h-8" />
          <span>Admin Console</span>
          {router.asPath === '/admin' ? (
            <IoIosArrowBack className="hidden md:visible" />
          ) : (
            <div className="w-5" />
          )}
        </Link>
      </div>
      <nav
        className={`text-base flex flex-col gap-3 transition-[height] ease-in-out duration-800 
         ${
           isExpanded
             ? 'h-[224px] md:h-auto mt-4'
             : 'h-0 overflow-hidden md:h-auto md:mt-4'
         }`}
      >
        <Link href="/admin/dashboard" className={linkClasses}>
          <BiTachometer className="w-6 h-6" />
          <span>Dashboard</span>
          {router.asPath === '/admin/dashboard' && <IoIosArrowBack />}
        </Link>
        <Link href="/admin/products" className={linkClasses}>
          <BsBoxSeam className="w-6 h-6" />
          <span>Products</span>
          {router.asPath === '/admin/products' && <IoIosArrowBack />}
        </Link>
        <Link href="/admin/categories" className={linkClasses}>
          <BsListUl className="w-6 h-6" />
          <span>Categories</span>
          {router.asPath === '/admin/categories' && <IoIosArrowBack />}
        </Link>
        <Link href="/admin/orders" className={linkClasses}>
          <HiOutlineClipboardDocumentList className="w-6 h-6" />
          <span>Orders</span>
          {router.asPath === '/admin/orders' && <IoIosArrowBack />}
        </Link>
        <Link href="/admin/users" className={linkClasses}>
          <HiOutlineUsers className="w-6 h-6" />
          <span>Users</span>
          {router.asPath === '/admin/users' && <IoIosArrowBack />}
        </Link>
        <Link href="/admin/settings" className={linkClasses}>
          <HiOutlineCog className="w-6 h-6" />
          <span>Settings</span>
          {router.asPath === '/admin/settings' && <IoIosArrowBack />}
        </Link>
      </nav>
    </aside>
  );
}

import React from 'react';
import Link from 'next/link';
import { HiOutlineMail } from 'react-icons/hi';
import logo from '~/public/images/logos/tach-logo.svg';

export function Footer() {
  return (
    <div className="w-full py-4 md:py-0 md:h-20 flex flex-col md:flex-row items-center justify-center gap-3 border-t border-tachGrey">
      <div className="flex items-center gap-3">
        <img className="w-24" src={logo} alt="Tach Logo" />
        <div className="text-sm flex gap-3">
          <Link
            href="https://www.tachignite.com"
            target="_blank"
            className="hover:text-tachPurple underline underline-offset-4 duration-300"
          >
            ©2023 Tach Ignite, Inc.
          </Link>
          <div>All Rights Reserved.</div>
        </div>
      </div>
      <Link
        href="/contact"
        className="hover:text-tachPurple underline underline-offset-4 duration-300"
      >
        <div className="flex gap-3 items-center">
          <HiOutlineMail className="w-6 h-6" />
          <div>Contact Us</div>
        </div>
      </Link>
    </div>
  );
}

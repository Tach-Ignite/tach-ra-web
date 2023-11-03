import Link from 'next/link';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { DarkModeToggle } from '../darkModeToggle';

export function LandingHeader() {
  return (
    <header className="h-24 flex items-center justify-between mx-4 border-b border-neutral-500">
      <Link className="flex items-center" href="/">
        <div className="mr-4">
          <img
            src="images/logos/tach-logo.svg"
            alt="Tach Logo"
            width={48}
            height={48}
            className="h-24"
          />
        </div>
        <div className="text-lg">Tach Ignite Web Reference Architecture</div>
      </Link>
      <div className="flex flex-row space-x-4 text-sm underline underline-offset-4">
        <Link
          href="/"
          className="hover:text-tachPurple transition duration-300"
        >
          Home
        </Link>
        <Link
          href="/demo"
          className="hover:text-tachPurple transition duration-300"
        >
          Demo
        </Link>
        <Link
          href="https://www.tachignite.com/about"
          target="_blank"
          className="hover:text-tachPurple transition duration-300"
        >
          <div className="flex items-center gap-1">
            About Tach
            <HiOutlineExternalLink className="h-4 w-4" />
          </div>
        </Link>
      </div>
      <div>
        <DarkModeToggle />
      </div>
    </header>
  );
}

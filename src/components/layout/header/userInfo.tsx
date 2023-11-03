import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BiCaretDown } from 'react-icons/bi';
import { HoverContainer } from '@/components/ui';
import { AccountDropdown } from './accountDropdown';

export function UserInfo() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    return (
      <>
        <Link
          href={{
            pathname: '/auth/signIn',
            query: { returnUrl: router.asPath },
          }}
          className="text-sm flex flex-col justify-center p-2 border border-transparent hover:border-tachGrey cursor-pointer duration-300 h-[70%]"
        >
          <p>Sign In</p>
        </Link>
        <Link
          href={{
            pathname: '/auth/register',
            query: { returnUrl: router.asPath },
          }}
          className="text-sm flex flex-col justify-center p-2 border border-transparent hover:border-tachGrey cursor-pointer duration-300 h-[70%]"
        >
          <p>Register</p>
        </Link>
      </>
    );
  }

  if (status === 'authenticated' && session) {
    return (
      <div className="flex justify-center items-center">
        {session.user.image && (
          <div>
            <img
              src={session.user.image}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full bg-cover"
              alt="user profile"
            />
          </div>
        )}
        <HoverContainer
          contents={<AccountDropdown />}
          contentClassName="-left-10 w-[152px]"
        >
          <div className="text-xs flex flex-col justify-center p-2 border border-transparent dark:hover:border-white hover:border-tachDark cursor-pointer duration-300 h-[70%]">
            <p>Hello, {session?.user.name}</p>
            <p className="bold flex item-center">
              Account & Lists
              <span>
                <BiCaretDown />
              </span>
            </p>
          </div>
        </HoverContainer>
      </div>
    );
  }

  return <>...</>;
}

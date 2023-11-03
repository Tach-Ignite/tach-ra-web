import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export type RouteProtectorProps = {
  allowedRole: string;
};

export function RouteProtector({
  allowedRole,
  children,
}: React.PropsWithChildren<RouteProtectorProps>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (
    status === 'unauthenticated' ||
    !session ||
    !session.user ||
    !session.user.roles
  ) {
    router.replace(`/auth/signIn?returnUrl=${router.pathname}`);
    return null;
  }

  if (!session?.user?.roles?.includes(allowedRole)) {
    router.replace('/auth/unauthorized');
    return null;
  }

  return children;
}

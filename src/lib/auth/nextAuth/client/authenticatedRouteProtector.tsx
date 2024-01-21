import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export type AuthenticatedRouteProtectorProps = {};

export function AuthenticatedRouteProtector({
  children,
}: React.PropsWithChildren<AuthenticatedRouteProtectorProps>) {
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

  return children;
}

import { PropsWithChildren } from 'react';
import { AuthenticatedRouteProtector } from '@/lib/auth/nextAuth/client/authenticatedRouteProtector';

export type AuthenticatedRouteLayoutProps = {
  allowedRole: string;
};

export function AuthenticatedRouteLayout({
  allowedRole,
  children,
}: PropsWithChildren<AuthenticatedRouteLayoutProps>) {
  return <AuthenticatedRouteProtector>{children}</AuthenticatedRouteProtector>;
}

import { PropsWithChildren } from 'react';
import { RouteProtector } from '@/lib/auth/nextAuth/client';

export type ProtectedRouteLayoutProps = {
  allowedRole: string;
};

export function ProtectedRouteLayout({
  allowedRole,
  children,
}: PropsWithChildren<ProtectedRouteLayoutProps>) {
  return <RouteProtector allowedRole={allowedRole}>{children}</RouteProtector>;
}

import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';
import { MiddlewareFactory } from '@/lib/abstractions';

export const passwordProtectedMiddlewareFactory: MiddlewareFactory = (
  next: NextMiddleware,
) =>
  async function middleware(request: NextRequest, _next: NextFetchEvent) {
<<<<<<< HEAD
=======
    const baseUrl = request.nextUrl.origin;
>>>>>>> internal-fork/main
    const path = request.nextUrl.pathname;

    if (
      path.startsWith(`/passwordProtected`) ||
      path.startsWith(`/api/passwordProtected`) ||
      path.startsWith(`/_next`) ||
      path.includes('.') ||
      path.includes('[object%20Object]')
    ) {
      return next(request, _next);
    }

    if (!request.cookies.has('__Secure-password-protected.session-token')) {
      return NextResponse.redirect(
<<<<<<< HEAD
        `${process.env.NEXT_PUBLIC_BASE_URL}/passwordProtected?returnUrl=${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
      );
    }

    try {
      const validateTokenResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/passwordProtected/validateToken`,
        {
          headers: { Cookie: request.cookies.toString() },
        },
      );
      if (!validateTokenResponse.ok) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/passwordProtected?returnUrl=${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
        );
      }

      const validateTokenResult = await validateTokenResponse.json();

      if (!validateTokenResult.valid) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/passwordProtected?returnUrl=${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
        );
      }
    } catch (e) {
      console.log(e);
=======
        `${baseUrl}/passwordProtected?returnUrl=${request.url}`,
      );
    }

    const validateTokenResponse = await fetch(
      `${baseUrl}/api/passwordProtected/validateToken`,
      {
        headers: { Cookie: request.cookies.toString() },
      },
    );
    if (!validateTokenResponse.ok) {
      return NextResponse.redirect(
        `${baseUrl}/passwordProtected?returnUrl=${request.url}`,
      );
    }

    const validateTokenResult = await validateTokenResponse.json();

    if (!validateTokenResult.valid) {
      return NextResponse.redirect(
        `${baseUrl}/passwordProtected?returnUrl=${request.url}`,
      );
>>>>>>> internal-fork/main
    }

    return next(request, _next);
  };

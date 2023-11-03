import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function SignOutPage() {
  const router = useRouter();
  let { returnUrl } = router.query;
  if (Array.isArray(returnUrl)) {
    [returnUrl] = returnUrl;
  }

  useEffect(() => {
    signOut({ callbackUrl: returnUrl as string });
  }, [returnUrl]);
}

export default SignOutPage;

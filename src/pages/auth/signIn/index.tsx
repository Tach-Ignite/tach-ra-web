import React from 'react';
import { useRouter } from 'next/router';
import { CenterContainer } from '@/components/ui';
import {
  CredentialsSignIn,
  OAuthButtonGrid,
  AuthFooter,
} from '@/components/auth';

function SignInPage() {
  const router = useRouter();
  let { returnUrl } = router.query;
  if (Array.isArray(returnUrl)) {
    [returnUrl] = returnUrl;
  }

  return (
    <CenterContainer>
      <div className="">
        <CredentialsSignIn returnUrl={returnUrl} />
      </div>
      <div className="flex mb-8 mt-2">
        <div className="flex-grow border-b" />
        <div className="relative flex-none px-8 top-3 text-2xl">or</div>
        <div className="flex-grow border-b" />
      </div>
      <div className="text-xl mb-2">
        Sign in using an authentication provider
      </div>
      <OAuthButtonGrid returnUrl={returnUrl} />
      <AuthFooter />
    </CenterContainer>
  );
}

export default SignInPage;

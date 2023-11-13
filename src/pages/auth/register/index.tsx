import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Session } from 'next-auth';
import { Register } from '@/components/auth';
import { CenterContainer, RootLayout } from '@/components';

function Page() {
  const router = useRouter();
  let { returnUrl } = router.query;
  if (Array.isArray(returnUrl)) {
    [returnUrl] = returnUrl;
  }

  return (
    <Register
      returnUrl={`/auth/register/createProfile${
        returnUrl ? `?returnUrl=${returnUrl}` : ''
      }`}
    />
  );
}

Page.getLayout = function getLayout(page: ReactElement, session: Session) {
  return (
    <RootLayout session={session}>
      <CenterContainer type="flex">{page}</CenterContainer>
    </RootLayout>
  );
};

export default Page;

import { Session } from 'next-auth';
import Link from 'next/link';
import { ReactElement } from 'react';
import { LandingLayout } from '../components/landing/landingLayout';

function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <div className="text-4xl md:text-5xl mb-4">
        Tach Ignite Web Reference Architecture
      </div>

      <Link href="/demo" className="text-2xl underline underline-offset-4">
        Try the Demo
      </Link>
    </div>
  );
}

LandingPage.getLayout = (page: ReactElement, session: Session) => (
  <LandingLayout>{page}</LandingLayout>
);

export default LandingPage;

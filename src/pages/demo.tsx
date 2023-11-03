import { Session } from 'next-auth';
import Link from 'next/link';
import { ReactElement } from 'react';
import { LandingLayout } from '../components/landing/landingLayout';

export default function DemoLandingPage() {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl mb-4">Tach Color Store Demo</div>
      <div className="flex gap-16">
        <div>
          <Link
            href="/products"
            target="_blank"
            className="text-2xl underline underline-offset-4 hover:text-tachPurple transition duration-300"
          >
            Customer Storefront
          </Link>
          <div className="mb-2" />
          <div>email: user@tachcolorstore.com</div>
          <div>password: userpassword</div>
        </div>
        <div>
          <Link
            href="/admin"
            target="_blank"
            className="text-2xl underline underline-offset-4 hover:text-tachPurple transition duration-300"
          >
            Admin Dashboard
          </Link>
          <div className="mb-2" />
          <div>email: admin@tachcolorstore.com</div>
          <div>password: adminpassword</div>
        </div>
      </div>
    </div>
  );
}

DemoLandingPage.getLayout = (page: ReactElement, session: Session) => (
  <LandingLayout>{page}</LandingLayout>
);

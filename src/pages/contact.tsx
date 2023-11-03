import { ReactElement } from 'react';
import { Session } from 'next-auth';
import { ContactUsForm, CenterContainer, RootLayout } from '@/components';

function ContactPage() {
  return <ContactUsForm />;
}

ContactPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  return (
    <RootLayout session={session}>
      <CenterContainer type="flex">{page}</CenterContainer>
    </RootLayout>
  );
};

export default ContactPage;

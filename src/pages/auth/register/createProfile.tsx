import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { Button, CenterContainer, Input } from '@/components/ui';
import { RootLayout } from '@/components';
import { useForm } from 'react-hook-form';
import {
  MutateUserProfileViewModel,
  mutateUserProfileViewModelSchema,
} from '@/models';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { customFormats } from '@/lib/utils';
import { useSetUserProfileMutation } from '@/rtk';
import { useSession } from 'next-auth/react';

function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  let { returnUrl } = router.query;
  if (Array.isArray(returnUrl)) {
    [returnUrl] = returnUrl;
  }
  const [setUserProfile, setUserProfileStatus] = useSetUserProfileMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<MutateUserProfileViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(mutateUserProfileViewModelSchema, {
      $data: true,
      formats: customFormats,
    }),
  });

  useEffect(() => {
    if (session?.user?.name) {
      setValue('name', session.user.name);
    }
  }, [session, setValue]);

  function onSubmit(values: MutateUserProfileViewModel) {
    setIsSubmitting(true);
    setUserProfile(values).then((result) => {
      setIsSubmitting(false);
      router.push((returnUrl as string) ?? '/');
    });
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (status === 'unauthenticated') {
    router.push(`/auth/signIn/returnUrl=${returnUrl}`);
    return <div>Redirecting...</div>;
  }

  return (
    <div>
      <h1>Create User Profile</h1>
      <p>This information is necessary to complete the registration process.</p>
      <form>
        <Input register={register} required label="Full Name" name="name" />
        <Input register={register} label="Phone" name="phoneNumber" />
        <Input
          register={register}
          type="checkbox"
          label="I agree to receive SMS/text messages"
          name="agreedToReceiveSmsNotifications"
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          isLoading={isSubmitting}
        >
          Save
        </Button>
      </form>
    </div>
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

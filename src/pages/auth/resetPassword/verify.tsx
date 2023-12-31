import { ajvResolver } from '@hookform/resolvers/ajv';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Session } from 'next-auth';
import { Button, Input, CenterContainer, RootLayout } from '@/components';
import { customFormats } from '@/lib/utils';
import { useUnauthenticatedResetPasswordMutation } from '@/rtk';
import {
  UnauthenticatedResetPasswordViewModel,
  unauthenticatedResetPasswordViewModelSchema,
} from '@/models';

function VerifyResetPasswordPage() {
  const router = useRouter();
  const [resetPassword, resetPasswordResponse] =
    useUnauthenticatedResetPasswordMutation();
  const [submitError, setSubmitError] = useState<string>('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const token = router.query.passwordResetToken as string;
  const email = router.query.email as string;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UnauthenticatedResetPasswordViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(unauthenticatedResetPasswordViewModelSchema, {
      allErrors: true,
      $data: true,
      formats: customFormats,
    }),
  });

  useEffect(() => {
    if (token) {
      setValue('token', token);
    }
  }, [token, setValue]);

  useEffect(() => {
    if (email) {
      setValue('email', email);
    }
  }, [email, setValue]);

  function submitHandler(
    form: UnauthenticatedResetPasswordViewModel,
    event: any,
  ) {
    event.preventDefault();
    resetPassword(form)
      .then((result: any) => {
        if (result.status && (result.status !== 200 || result.status !== 204)) {
          setSubmitError(result.data.message);
          setSendingRequest(false);
          return;
        }
        setPasswordChanged(true);
      })
      .catch((error: any) => {
        setSubmitError(error.toString());
        setSendingRequest(false);
      });
  }

  if (
    !router.query ||
    !router.query.passwordResetToken ||
    !router.query.email
  ) {
    return <>The password reset link is invalid.</>;
  }

  if (passwordChanged) {
    return (
      <>
        <div className="text-xl font-semibold mb-2">Password Changed</div>
        <div className="text-sm text-tachGrey">
          Your password has been changed successfully.
        </div>
        <Link
          href="/auth/signIn"
          className="hover:text-tachPurple underline underline-offset-4 duration-300"
        >
          Sign In
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="text-xl font-semibold">Reset Password</div>
      <div className="text-xs text-tachGrey">Email</div>
      <div>{email}</div>
      <form>
        <input type="hidden" {...register('token')} />
        <input type="hidden" {...register('email')} />
        <Input
          name="password"
          label="New Password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="New password"
          register={register}
          errorMessage={errors.password && errors.password.message}
        />
        <Input
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="New Password"
          register={register}
          errorMessage={
            errors.confirmPassword && errors.confirmPassword.message
          }
        />
        <Button
          className="mt-4 hover:bg-tachPurple hover:text-white"
          onClick={handleSubmit(submitHandler)}
          isLoading={sendingRequest}
        >
          Save Changes
        </Button>
      </form>
    </>
  );
}

VerifyResetPasswordPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  return (
    <RootLayout session={session}>
      <CenterContainer type="flex">{page}</CenterContainer>
    </RootLayout>
  );
};

export default VerifyResetPasswordPage;

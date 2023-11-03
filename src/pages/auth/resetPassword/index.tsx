import { ajvResolver } from '@hookform/resolvers/ajv';
import React, { useState, ReactElement } from 'react';
import { Session } from 'next-auth';
import { useForm } from 'react-hook-form';
import { Button, Input, CenterContainer, RootLayout } from '@/components';
import { customFormats } from '@/lib/utils';
import { useRequestPasswordResetMutation } from '@/rtk';
import {
  RequestPasswordResetViewModel,
  requestPasswordResetViewModelSchema,
} from '@/models';

function ResetPasswordPage() {
  const [requestPasswordReset, requestPasswordResetResponse] =
    useRequestPasswordResetMutation();
  const [submitError, setSubmitError] = useState<string>('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RequestPasswordResetViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(requestPasswordResetViewModelSchema, {
      allErrors: true,
      $data: true,
      formats: customFormats,
    }),
  });

  function submitHandler(form: RequestPasswordResetViewModel, event: any) {
    event.preventDefault();
    requestPasswordReset(form)
      .then((result: any) => {
        if (result.status && (result.status !== 200 || result.status !== 204)) {
          setSubmitError(result.data.message);
          setSendingRequest(false);
          return;
        }
        setEmailSent(true);
      })
      .catch((error: any) => {
        setSubmitError(error.toString());
        setSendingRequest(false);
      });
  }

  if (emailSent) {
    return (
      <div>
        <div className="text-xl font-semibold">Email Sent</div>
        <div className="text-sm text-textGrey">
          Please check your email for a password reset link. This link will
          expire in 30 minutes.
        </div>
      </div>
    );
  }

  return (
    <div>
      <form>
        <Input
          name="email"
          label="Email"
          type="text"
          required
          autoComplete="email"
          placeholder="bobsmith@example.com"
          register={register}
          errorMessage={errors.email && errors.email.message}
        />
        <Button
          className="mt-4"
          onClick={handleSubmit(submitHandler)}
          isLoading={sendingRequest}
        >
          Send Password Reset Link
        </Button>
      </form>
    </div>
  );
}

ResetPasswordPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  return (
    <RootLayout session={session}>
      <CenterContainer type="flex">{page}</CenterContainer>
    </RootLayout>
  );
};

export default ResetPasswordPage;

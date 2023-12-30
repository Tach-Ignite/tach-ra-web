import Link from 'next/link';
import { ajvResolver } from '@hookform/resolvers/ajv';
import Cookies from 'js-cookie';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { CredentialsViewModel, credentialsViewModelSchema } from '@/models';
import { Button, Input } from '../ui';

export type UseCredentialsProps = {
  returnUrl?: string;
};

export function CredentialsSignIn({ returnUrl }: UseCredentialsProps) {
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(credentialsViewModelSchema, { $data: true }),
  });

  const handleSignIn = async (values: CredentialsViewModel, event: any) => {
    event.preventDefault();
    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (response?.ok) {
        Cookies.remove('__Secure-next-auth.callback-url');
        router.push(returnUrl ?? '/');
      } else if (response?.error) {
        setError(response?.error);
      }
    } catch (error) {
      setError('Error signing in. Please try again later.');
    }
  };

  return (
    <>
      {error && (
        <div>
          <p>Error</p>
          <p>{error}</p>
        </div>
      )}
      <div className="text-xl mb-4">Sign in with an existing account</div>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <Input
          label="Email Address"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          register={register}
          errorMessage={errors.email && errors.email.message}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Password"
          register={register}
          errorMessage={errors.password && errors.password.message}
        />
        <div className="flex flex-col gap-3 items-center">
          <div className="flex w-full justify-center">
            <Button type="submit">Sign In</Button>
          </div>
          <div>
            <Link
              className="text-xs hover:text-tachPurple underline underline-offset-4 duration-300"
              href="/auth/resetPassword"
            >
              I forgot my password
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

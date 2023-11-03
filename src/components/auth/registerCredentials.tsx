import { ajvResolver } from '@hookform/resolvers/ajv';
import Cookies from 'js-cookie';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateUserMutation } from '@/rtk';
import { CreateUserViewModel, createUserViewModelSchema } from '@/models';
import { customFormats } from '@/lib/utils';
import { Button, Input } from '../ui';

export type CredentialsSignUpProps = {
  returnUrl?: string;
};

export function RegisterCredentials({ returnUrl }: CredentialsSignUpProps) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [createUser, createUserStatus] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateUserViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(createUserViewModelSchema, {
      allErrors: true,
      $data: true,
      formats: customFormats,
    }),
  });

  const handleSignup = async (values: CreateUserViewModel, event: any) => {
    event.preventDefault();
    try {
      const user = await createUser(values);
      if (user) {
        const response = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        if (response?.ok) {
          Cookies.remove('__Secure-next-auth.callback-url');
          update();
          router.push(returnUrl ?? '/');
        }
      }
    } catch (error) {
      setError('Error signing up. Please try again later.');
    }
  };

  return (
    <div>
      {error && (
        <div>
          <p>Error</p>
          <p>{error}</p>
        </div>
      )}
      <div className="text-xl mb-4">Sign up with email and password</div>
      <form onSubmit={handleSubmit(handleSignup)}>
        <div className="max-w-80">
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
          <Input
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Password"
            register={register}
            errorMessage={
              errors.confirmPassword && errors.confirmPassword.message
            }
          />
        </div>
        <div className="flex w-full justify-center">
          <Button type="submit">Register</Button>
        </div>
      </form>
    </div>
  );
}

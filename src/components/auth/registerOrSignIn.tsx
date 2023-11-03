import { RegisterCredentials } from './registerCredentials';
import { OAuthButtonGrid } from './oAuthButtonGrid';
import { AuthFooter } from './authFooter';
import { CredentialsSignIn } from './credentialsSignIn';

export type SignInOrSignUpProps = {
  returnUrl?: string;
};

export function RegisterOrSignIn({ returnUrl }: SignInOrSignUpProps) {
  return (
    <>
      <div className="flex">
        <div className="basis-1/2 pr-8 border-r">
          <RegisterCredentials returnUrl={returnUrl} />
        </div>
        <div className="basis-1/2 pl-8">
          <CredentialsSignIn returnUrl={returnUrl} />
        </div>
      </div>
      <div className="flex mb-8 mt-2">
        <div className="flex-grow border-b" />
        <div className="relative flex-none px-8 top-3 text-2xl">or</div>
        <div className="flex-grow border-b" />
      </div>
      <div className="text-xl mb-2">
        Sign up or sign in using an authentication provider
      </div>
      <OAuthButtonGrid returnUrl={returnUrl} />
      <AuthFooter />
    </>
  );
}
